-- ***************************************************************************
-- system 组织架构相关表
-- ***************************************************************************
DROP TABLE IF EXISTS sys_user;

CREATE TABLE IF NOT EXISTS `sys_user` (
  `user_id` BIGINT UNSIGNED PRIMARY KEY COMMENT '用户ID',
  `account` VARCHAR(32) NOT NULL COMMENT '用户账号',
  `pwd` VARCHAR(100) NOT NULL COMMENT '用户密码',
  `openid` VARCHAR(100) NULL COMMENT '微信小程序唯一标识id',
  `unionid` VARCHAR(100) NULL COMMENT '微信开放平台id',
  `nickname` VARCHAR(255) NOT NULL COMMENT '用户昵称',
  `avatar_id` BIGINT NULL COMMENT '头像对应的资源id',
  `email` VARCHAR(255) NULL COMMENT '邮箱',
  `phone` VARCHAR(255) NULL COMMENT '手机号码',
  `status` TINYINT(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT '账号状态, 0: 停用, 1:正常',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `deleter_id` BIGINT COMMENT '删除者id',
  `is_delete` TINYINT DEFAULT 0 NOT NULL COMMENT '是否删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  UNIQUE INDEX `account` (`account`) USING BTREE
) ENGINE = InnoDB DEFAULT charset = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT '用户信息表';

DROP TABLE IF EXISTS sys_role;

CREATE TABLE IF NOT EXISTS sys_role (
  `role_id` BIGINT NOT NULL COMMENT '角色ID',
  `role_name` VARCHAR(100) NOT NULL COMMENT '角色名称',
  `role_key` VARCHAR(50) NOT NULL COMMENT '角色标识',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `deleter_id` BIGINT COMMENT '删除者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`role_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色表';

DROP TABLE IF EXISTS sys_permission;

CREATE TABLE IF NOT EXISTS sys_permission (
  `permission_id` BIGINT NOT NULL COMMENT '权限ID',
  `permission_name` VARCHAR(50) NOT NULL COMMENT '权限名称',
  `type` TINYINT(1) DEFAULT 0 COMMENT '类型：0=菜单(C)，1=按钮(F)',
  `perms` VARCHAR(100) DEFAULT NULL COMMENT '权限标识（如：user:list, user:add）',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `deleter_id` BIGINT COMMENT '删除者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`permission_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '权限表';



DROP TABLE IF EXISTS sys_user_role_rel;

CREATE TABLE IF NOT EXISTS sys_user_role_rel (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_id` BIGINT NOT NULL COMMENT '角色ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  UNIQUE KEY `idx_user_role` (`user_id`, `role_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户角色关联表';

DROP TABLE IF EXISTS sys_role_permission_rel;

CREATE TABLE IF NOT EXISTS sys_role_permission_rel (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_id` BIGINT NOT NULL COMMENT '角色ID',
  `permission_id` BIGINT NOT NULL COMMENT '权限ID',
  UNIQUE KEY `idx_role_permission` (`role_id`, `permission_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '角色权限关联表';


DROP TABLE IF EXISTS sys_resource;

CREATE TABLE IF NOT EXISTS sys_resource (
  `resource_id` BIGINT UNSIGNED PRIMARY KEY COMMENT '资源ID',
  `resource_type` INT NOT NULL COMMENT '资源类型，1-用户头像, 2-CRM',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '所属用户ID',
  `storage_type` VARCHAR(20) NOT NULL DEFAULT 1 COMMENT '存储类型: 1-本地, 2-aliyun, 3-tencent, 4-superbed, 5-minio',
  `rel_path` VARCHAR(2000) COMMENT '存储相对路径',
  `preview_url` VARCHAR(2000) COMMENT '预览地址',
  `resource_name` VARCHAR(255) NOT NULL COMMENT '资源名称',
  `mime_type` VARCHAR(100) COMMENT 'MIME类型',
  `suffix` VARCHAR(20) NOT NULL COMMENT '资源后缀名',
  `size` BIGINT NOT NULL DEFAULT 0 COMMENT '资源大小',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `deleter_id` BIGINT COMMENT '删除者id',
  `is_delete` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '资源信息表';

-- ***************************************************************************
-- crm 客户管理相关表
-- 采用配置表 + JSONB存储客户信息的方式实现crm
-- ***************************************************************************
DROP TABLE IF EXISTS crm_customer_entity;
CREATE TABLE IF NOT EXISTS crm_customer_entity (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `entity_name` VARCHAR(50) NOT NULL COMMENT '逻辑表名（如：企业客户）',
  `entity_code` VARCHAR(50) NOT NULL UNIQUE COMMENT '唯一标识（如：enterprise_customer）',
  `description` VARCHAR(255) COMMENT '描述',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `deleter_id` BIGINT COMMENT '删除者id',
  `is_delete` TINYINT DEFAULT 0 NOT NULL COMMENT '是否删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '客户表定义（如区分企业、个人等）';
DROP TABLE IF EXISTS crm_customer_fields;

CREATE TABLE IF NOT EXISTS crm_customer_fields (
  `id` BIGINT UNSIGNED PRIMARY KEY,
  `entity_id`BIGINT UNSIGNED NOT NULL COMMENT '所属逻辑表ID',
  `field_key` VARCHAR(50) NOT NULL COMMENT '程序表字段名(英文)',
  `field_name` VARCHAR(100) NOT NULL COMMENT '字段名解释',
  `data_type` VARCHAR(20) NOT NULL COMMENT '数据类型',
  `options` JSON COMMENT '当数据类型为选择器时的选项值',
  `is_required` TINYINT DEFAULT 0 COMMENT '是否必填',
  `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
  `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `deleter_id` BIGINT COMMENT '删除者id',
  `is_delete` TINYINT DEFAULT 0 NOT NULL COMMENT '是否删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '客户信息字段配置表';

DROP TABLE IF EXISTS crm_customer_values;
CREATE TABLE IF NOT EXISTS crm_customer_values (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `entity_id`BIGINT UNSIGNED NOT NULL COMMENT '所属逻辑表ID',
  `customer_name` VARCHAR(100) NOT NULL COMMENT '固定字段, 客户名称',
  `remark` VARCHAR(1000) COMMENT '备注',
  `values` JSON NULL COMMENT '客户数据',
  `user_id` BIGINT NOT NULL COMMENT '所属id',
   `creator_id` BIGINT NOT NULL COMMENT '创建者id',
  `updater_id` BIGINT COMMENT '更新者id',
  `deleter_id` BIGINT COMMENT '删除者id',
  `is_delete` TINYINT DEFAULT 0 NOT NULL COMMENT '是否删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '客户信息数据表';