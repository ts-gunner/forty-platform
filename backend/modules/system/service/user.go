package service

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jinzhu/copier"
	"github.com/ts-gunner/forty-platform/common/constant"
	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	"github.com/ts-gunner/forty-platform/common/response"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"github.com/ts-gunner/forty-platform/common/storage"
	"github.com/ts-gunner/forty-platform/common/utils"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type UserService struct{}

func (UserService) GetSysUserByAccount(account string) (*entity.SysUser, error) {
	var sysUser entity.SysUser
	if err := global.DB.Where(map[string]any{
		"account":   account,
		"is_delete": 0,
	}).First(&sysUser).Error; err != nil {
		return nil, err
	} else {
		return &sysUser, nil
	}
}

func (UserService) GetSysUserById(userId int64) (*entity.SysUser, error) {
	var sysUser entity.SysUser
	if err := global.DB.Where(map[string]any{
		"user_id":   userId,
		"is_delete": 0,
	}).First(&sysUser).Error; err != nil {
		return nil, err
	}
	return &sysUser, nil
}

func (UserService) GetUserList(req request.UserListRequest) (*response.PageResult[systemResponse.UserVo], error) {
	var list []systemResponse.UserVo
	var total int64

	db := global.DB.Table("sys_user u").Where("u.is_delete = ?", 0)

	if req.Account != "" {
		db = db.Where("account LIKE ?", "%"+req.Account+"%")
	}
	if req.NickName != "" {
		db = db.Where("nickname LIKE ?", "%"+req.NickName+"%")
	}
	if req.Phone != "" {
		db = db.Where("phone LIKE ?", "%"+req.Phone+"%")
	}
	if req.Status != nil {
		db = db.Where("status = ?", *req.Status)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, err
	}

	if req.PageNum <= 0 {
		req.PageNum = 1
	}
	if req.PageSize <= 0 {
		req.PageSize = 10
	}
	selectQuery := `
	u.user_id AS user_id,
	u.nickname AS nick_name,
	u.account AS account,
	u.openid AS open_id,
	u.nickname AS nick_name,
	u.phone AS phone,
	u.email AS email,
	u.avatar_id AS avatar_id,
	u.status AS status,
	u.create_time AS create_time,
	u.update_time AS update_time,
	(
        SELECT GROUP_CONCAT(sr.role_name SEPARATOR ',') 
        FROM sys_user_role_rel surr
        LEFT JOIN sys_role sr ON sr.role_id = surr.role_id AND sr.is_delete = 0
        WHERE surr.user_id = u.user_id
    ) AS role_names`
	offset := (req.PageNum - 1) * req.PageSize
	if err := db.Select(selectQuery).Order("create_time DESC").Offset(offset).Limit(req.PageSize).Find(&list).Error; err != nil {
		return nil, err
	}

	return &response.PageResult[systemResponse.UserVo]{
		List:     list,
		Total:    total,
		PageNum:  req.PageNum,
		PageSize: req.PageSize,
	}, nil
}

func (s UserService) CreateUser(ctx context.Context, req request.UserCreateRequest) error {
	existUser, _ := s.GetSysUserByAccount(req.Account)
	if existUser != nil {
		return errors.New("账号已存在")
	}
	userId, _ := global.IdCreator.NextID()
	user := entity.SysUser{
		UserId:   userId,
		Account:  req.Account,
		Password: utils.EncryptBySM3(req.Password),
		NickName: req.NickName,
		Phone:    req.Phone,
		Email:    req.Email,
		AvatarId: 0,
		Status:   req.Status,
		BaseRecordField: entity.BaseRecordField{
			CreatorId: utils.GetLoginUserId(ctx),
		},
	}
	if user.Status == 0 {
		user.Status = 1
	}

	return global.DB.Create(&user).Error
}

func (s UserService) UpdateUser(ctx context.Context, req request.UserUpdateRequest) error {
	user, err := s.GetSysUserById(req.UserId)
	if err != nil {
		return errors.New("用户不存在")
	}

	updates := map[string]any{}
	if req.NickName != "" {
		updates["nickname"] = req.NickName
	}
	if req.Phone != "" {
		updates["phone"] = req.Phone
	}
	if req.Email != "" {
		updates["email"] = req.Email
	}
	if req.AvatarId != "" {
		updates["avatar_id"] = req.AvatarId
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}
	updates["updater_id"] = utils.GetLoginUserId(ctx)
	if len(updates) == 0 {
		return nil
	}

	return global.DB.Model(user).Updates(updates).Error
}

func (s UserService) ResetPassword(ctx context.Context, req request.UserResetPwdRequest) error {
	user, err := s.GetSysUserById(req.UserId)
	if err != nil {
		return errors.New("用户不存在")
	}
	userId := utils.GetLoginUserId(ctx)
	return global.DB.Model(user).Updates(entity.SysUser{
		Password: utils.EncryptBySM3(req.NewPassword),
		BaseRecordField: entity.BaseRecordField{
			UpdaterId: &userId,
		},
	}).Error
}

func (s UserService) DeleteUser(ctx context.Context, userId int64) error {
	user, err := s.GetSysUserById(userId)
	if err != nil {
		return errors.New("用户不存在")
	}
	userId = utils.GetLoginUserId(ctx)
	localTime := time.Now().Local()
	// 清理casbin的policy和group
	_, _ = global.Enforcer.RemoveFilteredPolicy(0, strconv.FormatInt(userId, 10))
	_, _ = global.Enforcer.RemoveFilteredGroupingPolicy(0, strconv.FormatInt(userId, 10))
	return global.DB.Model(user).Updates(entity.SysUser{
		BaseRecordField: entity.BaseRecordField{
			DeleterId: &userId,
		},
		BaseSchemaField: entity.BaseSchemaField{
			IsDelete:   1,
			DeleteTime: &localTime,
		},
	}).Error
}

func (s UserService) GetUserDetail(userId int64) (*systemResponse.UserVo, error) {
	user, err := s.GetSysUserById(userId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("用户不存在")
		}
		return nil, err
	}

	return &systemResponse.UserVo{
		UserId:     user.UserId,
		Account:    user.Account,
		NickName:   user.NickName,
		Phone:      user.Phone,
		Email:      user.Email,
		Avatar:     "",
		Status:     user.Status,
		CreateTime: user.CreateTime,
		UpdateTime: user.UpdateTime,
	}, nil
}

func (s UserService) UploadUserProfile(ctx context.Context, req request.UpdateUserProfileRequest) (string, error) {
	operatorId := utils.GetLoginUserId(ctx)
	updateMap := make(map[string]any)
	if req.Avatar != nil {
		vo, err := SystemService.SystemResourceService.UploadAvatar(ctx, req.Avatar)
		if err != nil {
			global.Logger.Error("UploadAvatar err", zap.Error(err))
			return "", fmt.Errorf("头像上传失败")
		}
		if vo == nil {
			return "", fmt.Errorf("头像上传失败, 对象为空")
		}
		updateMap["avatar_id"] = vo.ResourceId
	}
	if req.NickName != "" {
		updateMap["nickname"] = req.NickName
	}
	token := ""
	err := global.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&entity.SysUser{}).Where("user_id = ? and is_delete = 0", operatorId).Updates(updateMap).Error; err != nil {
			return err
		}
		user, err := userMapper.GetUserById(tx, operatorId)
		if err != nil {
			return err
		}
		url := ""
		if user.AvatarId != 0 {
			resource, err := resourceMapper.GetResourceById(tx, user.AvatarId)
			if err != nil {
				return err
			}

			policy, err := storage.GetPolicyByMode(global.Store, storage.StorageMode(resource.StorageType))
			if err != nil {
				return err
			}
			url, err = policy.GetAccessUrl(storage.StorageVo{
				RelativePath: resource.RelPath,
				DirectUrl:    resource.PreviewUrl,
			})
			if err != nil {
				return err
			}
		}

		claim := systemResponse.LoginUserClaim{
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			},
		}
		_ = copier.Copy(&claim, &user)
		claim.Avatar = url
		token = utils.CreateToken(claim, constant.SALT)
		return nil
	})
	if err != nil {
		return "", err
	}

	return token, nil
}

func (UserService) GetUserListByRoleKey(req request.GetUserListByRoleKeyRequest) (*response.PageResult[systemResponse.UserVo], error) {
	var list []systemResponse.UserVo
	var total int64

	// 先根据 roleKey 找到角色ID
	var role entity.SysRole
	if err := global.DB.Where("role_key = ? and is_delete = 0", req.RoleKey).First(&role).Error; err != nil {
		return nil, errors.New("角色不存在")
	}

	// 构建查询
	db := global.DB.Table("sys_user u").
		Joins("JOIN sys_user_role_rel surr ON u.user_id = surr.user_id").
		Where("u.is_delete = ? AND surr.role_id = ?", 0, role.RoleId)

	// 获取总数
	if err := db.Count(&total).Error; err != nil {
		return nil, err
	}

	// 分页参数处理
	if req.PageNum <= 0 {
		req.PageNum = 1
	}
	if req.PageSize <= 0 {
		req.PageSize = 10
	}

	// 查询用户列表
	selectQuery := `
	u.user_id AS user_id,
	u.nickname AS nick_name,
	u.account AS account,
	u.openid AS open_id,
	u.nickname AS nick_name,
	u.phone AS phone,
	u.email AS email,
	u.avatar_id AS avatar_id,
	u.status AS status,
	u.create_time AS create_time,
	u.update_time AS update_time,
	(
        SELECT GROUP_CONCAT(sr.role_name SEPARATOR ',') 
        FROM sys_user_role_rel surr
        LEFT JOIN sys_role sr ON sr.role_id = surr.role_id AND sr.is_delete = 0
        WHERE surr.user_id = u.user_id
    ) AS role_names`
	offset := (req.PageNum - 1) * req.PageSize
	if err := db.Select(selectQuery).Order("u.create_time DESC").Offset(offset).Limit(req.PageSize).Find(&list).Error; err != nil {
		return nil, err
	}

	return &response.PageResult[systemResponse.UserVo]{
		List:     list,
		Total:    total,
		PageNum:  req.PageNum,
		PageSize: req.PageSize,
	}, nil
}
