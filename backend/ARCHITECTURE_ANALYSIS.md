# Backend 架构分析报告

## 一、当前架构概览

### 1.1 目录结构

```
backend/
├── main.go                      # 入口：初始化全局变量 + 启动服务
├── common/                       # 跨模块共享层
│   ├── constant/                # 常量定义
│   ├── entity/                  # GORM 模型 (base, system, crm, audit)
│   ├── enums/                   # 枚举
│   ├── global/                  # 全局单例 (DB, Redis, Logger, Enforcer, IdCreator, Store)
│   ├── handler/                 # Gin 中间件 (鉴权、角色检查、日志)
│   ├── models/                  # Casbin 规则模型
│   ├── request/                 # 请求 DTO (按模块分子目录)
│   ├── response/                # 响应 DTO + ApiResult/PageResult 泛型封装
│   ├── storage/                 # 存储抽象 (local/aliyun/minio/tencent/superbed)
│   └── utils/                   # 工具函数
├── config/                       # 配置结构体
├── core/                         # 基础设施初始化 (DB, Redis, Router, Server, Casbin, Viper, Zap)
│   └── internal/                # Zap 核心扩展
├── docs/                         # Swagger 文档
├── knife4j/                      # API 文档 UI
└── modules/                      # 业务模块
    ├── system/                  # 系统管理 (用户/角色/权限/资源)
    │   ├── controller/          # 7 个子路由
    │   ├── service/             # 7 个 service
    │   ├── mapper/             # 3 个 mapper (共 5 个方法)
    │   └── task/                # 定时任务 (cron)
    ├── crm/                     # 客户关系管理
    │   ├── controller/          # 4 个子路由
    │   ├── service/             # 4 个 service
    │   └── mapper/             # 2 个 mapper (共 4 个方法)
    ├── audit/                   # 审核管理
    │   ├── controller/
    │   └── service/             # ← 无 mapper 层
    └── analysis/                # 数据统计分析
        ├── controller/
        └── service/             # ← 无 mapper 层
```

### 1.2 分层调用关系

```
Controller → Service → (有时)Mapper → global.DB
     ↑           ↑          ↑
     └── 直接使用 global.DB (大量绕过 mapper)
     └── 包含业务逻辑 (auth controller)
     └── 跨模块直接依赖 (crm service → system service)
```

### 1.3 "enter.go" 聚合模式

每个模块通过 `enter.go` 文件用 struct embedding 聚合同层组件：

```go
// controller/enter.go
type RouterGroup struct {
    AuthRouter
    UserRouter
    RoleRouter
    // ...
}
var SystemRouter = new(RouterGroup)

// service/enter.go
type ServiceGroup struct {
    AuthService
    UserService
    RoleService
    // ...
}
var SystemService = new(ServiceGroup)

// controller 中通过包级变量引用 service
var userService = service.SystemService.UserService
```

这是一种 **Service Locator 模式**，通过全局变量隐式传递依赖。

---

## 二、核心问题分析

### 问题 1：Mapper 层形同虚设 — 最大的层级冗余

**现状**：mapper 层总共只有 5 个方法，且几乎都是单行 GORM 查询的包装：

| Mapper | 方法数 | 方法列表 |
|--------|--------|----------|
| `SysUserMapper` | 1 | `GetUserById(tx, userId)` |
| `RoleMapper` | 2 | `GetRoleByRoleKey(tx, key)`, `GetRoleListByUserId(tx, userId)` |
| `SysResourceMapper` | 1 | `GetResourceById(tx, resourceId)` |
| `CrmEntityMapper` | 2 | `GetEntityById(id)`, `GetEntityByKey(key)` |
| `CrmEntityFieldMapper` | 2 | `GetEntityFieldsByEntityId(tx, id)`, `GetEntityFieldsByEntityIdWithDeleted(tx, id)` |

**与此同时，service 层大量直接使用 `global.DB` 操作数据库**：

| Service 文件 | `global.DB` 直接调用次数 | mapper 调用次数 |
|-------------|------------------------|----------------|
| `system/service/user.go` | 8 | 1 |
| `system/service/role.go` | 6 | 1 |
| `system/service/permission.go` | 8 | 0 |
| `system/service/resource.go` | 4 | 1 |
| `system/service/user_role_rel.go` | 6 | 0 |
| `system/service/role_permission_rel.go` | 6 | 0 |
| `crm/service/entity.go` | 4 | 3 |
| `crm/service/value.go` | 12 | 2 |
| `crm/service/favorite.go` | 8 | 1 |
| `crm/service/field.go` | 4 | 2 |
| `analysis/service/statistics.go` | 4 | 0 (无 mapper) |
| `audit/service/review.go` | 4 | 0 (无 mapper) |

**结论**：mapper 层覆盖率不到 15%，service 在绝大多数情况下直接穿透到 `global.DB`。这一层不仅没有起到数据访问隔离的作用，反而制造了"分层"的假象，增加了维护成本。

---

### 问题 2：四模块分层不一致

| 模块 | Controller | Service | Mapper | Task |
|------|-----------|---------|--------|------|
| system | ✅ | ✅ | ✅ | ✅ |
| crm | ✅ | ✅ | ✅ | ❌ |
| audit | ✅ | ✅ | ❌ | ❌ |
| analysis | ✅ | ✅ | ❌ | ❌ |

`analysis` 和 `audit` 模块没有 mapper 层，service 直接用 `global.DB.Raw(...)` 写原生 SQL。这种不一致导致：
- 新开发者无法判断"新模块应该有几层"
- 有 mapper 的模块和没 mapper 的模块，service 代码风格完全一致（都是直接用 `global.DB`），mapper 的存在更像是"为了有而有"

---

### 问题 3：Controller 层泄漏业务逻辑

典型反例 — `system/controller/auth.go` 的 `adminPwdLogin`：

```go
func adminPwdLogin(c *gin.Context) {
    // 参数绑定 (合理)
    var req request.PwdLoginRequest
    c.ShouldBindJSON(&req)

    // ↓ 以下全部是业务逻辑，不应在 controller 中

    // 1. 查用户
    user, _ := userService.GetSysUserByAccount(req.Username)

    // 2. 密码校验
    if utils.EncryptBySM3(req.Password) != user.Password { ... }

    // 3. 状态校验
    if user.Status == 0 { ... }

    // 4. Casbin 权限校验
    ok, err := global.Enforcer.HasGroupingPolicy(...)

    // 5. 生成 token
    token, err := authService.AdminLogin(user)
}
```

Controller 应该只做：参数绑定 → 调 service → 返回响应。密码校验、状态检查、权限校验都应下沉到 `AuthService.AdminLogin()`。

---

### 问题 4：跨模块硬依赖

`crm/service/enter.go`：

```go
import systemService "github.com/ts-gunner/forty-platform/modules/system/service"

var resourceService = systemService.SystemService.SystemResourceService
```

crm 模块的 service 层 **直接 import 了 system 模块的 service 包**，形成了模块间的编译期耦合。如果 system 的 `SystemResourceService` 签名变化，crm 模块会直接编译失败。正确的做法是通过接口或共享 service 解耦。

---

### 问题 5：Service 层职责混杂

以 `crm/service/value.go` 为例（最复杂的 service 文件，555 行）：

| 职责 | 代码位置 | 问题 |
|------|---------|------|
| 数据库 CRUD | 多处 `global.DB.xxx` | 应在 mapper/repository 层 |
| JSON 序列化/反序列化 | `handleValueByFieldList`, `validateValue` | 数据转换逻辑 |
| Excel 文件解析 | `HandleUploadExcel` | 文件处理逻辑，不属于 service |
| Casbin 权限校验 | `global.Enforcer.HasGroupingPolicy` | 权限逻辑散落在 service |
| 业务校验 | `validateValue` 中的字段类型校验 | 合理，但与上面混在一起 |
| 分页计算 | `pageNum`, `pageSize`, `offset` | 每个列表方法重复 |
| Entity → VO 转换 | `copier.Copy` + 手动赋值 | 每个方法重复 |

一个 service 方法中混合了 5-6 种职责，违反单一职责原则。

---

### 问题 6：Mapper API 设计不一致

同一 mapper 内的方法签名不统一：

```go
// CrmEntityFieldMapper — 接受 tx 参数
func (CrmEntityFieldMapper) GetEntityFieldsByEntityIdWithDeleted(tx *gorm.DB, entityId int64)

// CrmEntityFieldMapper — 直接用 global.DB，不接受 tx
func (CrmEntityFieldMapper) GetEntityFieldsByEntityId(tx *gorm.DB, entityId int64)
    // ↑ 签名写了 tx 但内部用 global.DB，tx 参数被忽略！
```

`CrmEntityMapper` 则完全不接受 `tx` 参数，直接用 `global.DB`：

```go
func (CrmEntityMapper) GetEntityById(entityId int64) // 用 global.DB
```

而 system 模块的 mapper 全部接受 `tx *gorm.DB` 参数。这种不一致使得事务管理混乱。

---

### 问题 7：重复的样板代码

**分页逻辑**（出现 10+ 次）：

```go
if req.PageNum <= 0 { req.PageNum = 1 }
if req.PageSize <= 0 { req.PageSize = 10 }
offset := (req.PageNum - 1) * req.PageSize
```

部分地方用了 `utils.GetCurrentPage()` 和 `utils.GetPageSize()`，部分地方手写，不统一。

**Entity → VO 转换**（每个 service 方法手动赋值）：

```go
// system/service/user.go - GetUserDetail
return &systemResponse.UserVo{
    UserId: user.UserId, Account: user.Account, ...
}

// system/service/role.go - GetRoleDetail
return &systemResponse.RoleVo{
    RoleId: role.RoleId, RoleName: role.RoleName, ...
}
```

有的用了 `copier.Copy`，有的手动赋值，风格不统一。

---

### 问题 8：全局状态耦合

`common/global/global.go` 暴露 7 个全局变量，几乎所有文件都直接引用：

```go
var (
    Config    *config.AppConfig
    DB        *gorm.DB
    Logger    *zap.Logger
    Redis     *redis.Client
    IdCreator *sonyflake.Sonyflake
    Enforcer  *casbin.Enforcer
    Store     map[storage.StorageMode]storage.StoragePolicy
)
```

- 无法做单元测试（无法 mock DB/Redis/Enforcer）
- 所有层都能直接访问数据库，层间隔离名存实亡
- `handler/authorization.go` 中间件也直接查 `global.DB`，认证逻辑与数据访问耦合

---

### 问题 9：缺乏接口抽象

所有 service 和 mapper 都是具体 struct，没有定义 interface：

```go
type UserService struct{}      // 无接口
type RoleService struct{}      // 无接口
type EntityService struct{}    // 无接口
```

后果：
- 无法 mock 测试
- 跨模块依赖只能依赖具体类型
- 无法实现依赖注入

---

### 问题 10：定时任务层调用链混乱

`system/task/role.go` 中的 `AddCrmRole()` 同时使用了 service 和 mapper：

```go
func AddCrmRole() {
    // 直接用 global.DB.Transaction
    global.DB.Transaction(func(tx *gorm.DB) error {
        // 调 service
        roleList, err := service.SystemService.GetRolesByUserId(user.UserId)
        // 又直接调 mapper
        role, err := mapper.SystemMapper.RoleMapper.GetRoleByRoleKey(tx, ...)
        // 又调 service
        service.SystemService.AssignRolesToUser(tx, ...)
    })
}
```

task 层同时跨越了 service 和 mapper 两层，进一步证明 mapper 层的定位模糊。

---

## 三、问题汇总与严重度

| # | 问题 | 严重度 | 类型 |
|---|------|--------|------|
| 1 | Mapper 层形同虚设，覆盖率 <15% | **高** | 层级冗余 |
| 2 | 四模块分层不一致 | **高** | 架构一致性 |
| 3 | Controller 泄漏业务逻辑 | **中** | 职责划分 |
| 4 | 跨模块硬依赖 (crm→system) | **中** | 模块耦合 |
| 5 | Service 层职责混杂 (5-6 种职责) | **高** | 职责划分 |
| 6 | Mapper API 签名不一致 | **中** | 代码规范 |
| 7 | 重复样板代码 (分页、转换) | **中** | 代码复用 |
| 8 | 全局状态耦合 (无法测试) | **高** | 可维护性 |
| 9 | 缺乏接口抽象 | **高** | 可维护性/可测试性 |
| 10 | Task 层调用链混乱 | **低** | 职责划分 |

---

## 四、改进建议

### 建议 1：简化为两层架构 — 移除 Mapper 层

**理由**：当前 mapper 层总共只有 8 个方法，且 service 层已经直接使用 `global.DB` 完成了 85%+ 的数据操作。维持一个形同虚设的 mapper 层增加了认知负担和维护成本，弊大于利。

**方案**：移除 `modules/*/mapper/` 目录，将 mapper 中仅有的几个方法合并到对应 service 中（它们本来就是简单的 GORM 查询）。

**改动后的架构**：

```
modules/
├── system/
│   ├── controller/    # HTTP 路由 + 参数绑定 + 响应
│   ├── service/       # 业务逻辑 + 数据访问 (GORM)
│   └── task/           # 定时任务
├── crm/
│   ├── controller/
│   └── service/
├── audit/
│   ├── controller/
│   └── service/
└── analysis/
    ├── controller/
    └── service/
```

统一为 **Controller → Service** 两层架构，所有模块保持一致。

**如果未来需要数据访问隔离**（如多数据源、读写分离），再引入真正的 Repository 接口层，而非当前这种半吊子 mapper。

---

### 建议 2：Controller 瘦身 — 业务逻辑下沉

将 `adminPwdLogin` 改为：

```go
// controller/auth.go — 只做参数绑定和响应
func adminPwdLogin(c *gin.Context) {
    var req request.PwdLoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        response.Fail(http.StatusBadRequest, "参数校验异常", c)
        return
    }
    token, err := authService.AdminLogin(req.Username, req.Password)
    if err != nil {
        response.Fail(...)
        return
    }
    response.Data[string](token, c)
}

// service/auth.go — 业务逻辑全在这里
func (s *AuthService) AdminLogin(username, password string) (string, error) {
    user, err := userService.GetSysUserByAccount(username)
    if user == nil { return "", errors.New("用户不存在") }
    if utils.EncryptBySM3(password) != user.Password { return "", errors.New("密码错误") }
    if user.Status == 0 { return "", errors.New("账号已停用") }
    ok, _ := global.Enforcer.HasGroupingPolicy(strconv.FormatInt(user.UserId, 10), constant.ROLE_ADMIN)
    if !ok { return "", errors.New("没有权限登录管理端") }
    // 生成 token...
}
```

---

### 建议 3：提取公共分页和转换工具

```go
// common/utils/page.go
func BuildPageQuery[T any](req PageRequest) (offset, limit int, pageNum, pageSize int) {
    pageNum = max(req.GetPageNum(), 1)
    pageSize = max(req.GetPageSize(), 10)
    offset = (pageNum - 1) * pageSize
    return
}

// 使用
offset, limit, pageNum, pageSize := utils.BuildPageQuery(req)
db.Offset(offset).Limit(limit).Find(&list)
```

统一所有列表查询的分页逻辑，消除 10+ 处重复代码。

---

### 建议 4：跨模块依赖改用接口

```go
// crm/service/enter.go
// 之前: 直接 import system service
// var resourceService = systemService.SystemService.SystemResourceService

// 之后: 通过接口依赖
type ResourceService interface {
    GetResourceById(resourceId int64) (*entity.SysResource, error)
    GetResourceAccessUrl(resourceId int64) (string, error)
}
```

或在 `common/` 中定义跨模块共享的 service 接口，由各模块实现。

---

### 建议 5：引入 Repository 接口（中期，可选）

如果项目规模继续增长，可以引入真正的 Repository 模式：

```go
// 定义接口
type UserRepository interface {
    FindById(ctx context.Context, id int64) (*entity.SysUser, error)
    FindByAccount(ctx context.Context, account string) (*entity.SysUser, error)
    List(ctx context.Context, req ListRequest) ([]entity.SysUser, int64, error)
    Create(ctx context.Context, user *entity.SysUser) error
    Update(ctx context.Context, user *entity.SysUser) error
    SoftDelete(ctx context.Context, id int64) error
}

// 实现
type userRepo struct {
    db *gorm.DB
}
func (r *userRepo) FindById(ctx context.Context, id int64) (*entity.SysUser, error) {
    var u entity.SysUser
    err := r.db.WithContext(ctx).Where("user_id = ? AND is_delete = 0", id).First(&u).Error
    return &u, err
}

// service 通过构造函数注入
type UserService struct {
    repo UserRepository
}
func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}
```

这样可实现依赖注入和可测试性，但成本较高，建议在重构周期中逐步推进。

---

### 建议 6：统一 Mapper/Service 的事务参数传递（短期）

如果暂时保留 mapper，至少统一事务传递方式：
- 要么所有 mapper 方法都接受 `*gorm.DB`（支持事务）
- 要么都不接受（内部用 `global.DB`）

当前 `CrmEntityFieldMapper.GetEntityFieldsByEntityId` 签名有 `tx` 参数但内部用 `global.DB`，这是 bug。

---

## 五、架构演进路线图

### Phase 1：快速清理（1-2 天）
1. 移除 `modules/*/mapper/` 目录，将 8 个方法合并到对应 service
2. 统一 `analysis`/`audit` 与 `system`/`crm` 的分层为两层
3. 提取公共分页工具，替换 10+ 处重复代码
4. 修复 `CrmEntityFieldMapper` 的 tx 参数 bug

### Phase 2：职责归位（3-5 天）
1. Controller 业务逻辑下沉到 Service（重点是 `auth.go`）
2. Excel 解析逻辑从 service 提取到 utils 或独立 handler
3. 统一 Entity → VO 转换方式（全部用 copier 或全部手动）

### Phase 3：解耦与可测试性（1-2 周）
1. 跨模块依赖改用接口
2. 为核心 service 定义 interface
3. 引入依赖注入（构造函数传参，替代全局变量引用）
4. 为关键路径编写单元测试

### Phase 4：Repository 模式（可选，按需）
1. 引入真正的 Repository 接口层
2. 实现依赖注入容器
3. 全面的 mock 测试覆盖

---

## 六、结论

当前架构名义上是 **Controller → Service → Mapper** 三层架构，但实际上：

1. **Mapper 层覆盖率不到 15%**，形同虚设，是纯粹的层级冗余
2. **Service 层直接穿透到 `global.DB`**，三层架构退化为两层
3. **模块间分层不一致**（system/crm 有 mapper，audit/analysis 没有）
4. **Controller 泄漏业务逻辑**、**Service 职责混杂**、**全局状态耦合**等问题叠加

**核心建议**：**简化为 Controller → Service 两层架构**，移除 Mapper 层，统一所有模块的分层方式。这能立即解决层级冗余和分层不一致两个最大问题，降低认知负担，且不引入新的复杂度。

如果未来项目规模增长到需要数据访问隔离（多数据源、读写分离、缓存策略等），再引入真正的 Repository 接口层 — 那时才是三层架构的正确时机。
