package service

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/ts-gunner/forty-platform/common/entity"
	"github.com/ts-gunner/forty-platform/common/global"
	request "github.com/ts-gunner/forty-platform/common/request/system"
	"github.com/ts-gunner/forty-platform/common/response"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
	"github.com/ts-gunner/forty-platform/common/utils"
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
		AvatarId: req.AvatarId,
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
		AvatarId:   user.AvatarId,
		Status:     user.Status,
		CreateTime: user.CreateTime,
		UpdateTime: user.UpdateTime,
	}, nil
}

func (s UserService) UploadAvatar(ctx context.Context, req request.UpdateAvatarRequest) (systemResponse.SysResourceVo, error) {
	vo := systemResponse.SysResourceVo{}
	
	return vo, nil
}
