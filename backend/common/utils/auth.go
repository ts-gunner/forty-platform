package utils

import (
	"context"
	"github.com/ts-gunner/forty-platform/common/constant"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
)

func GetLoginUserInfo(ctx context.Context) *systemResponse.AdminUserClaim {
	loginUser := ctx.Value(constant.USER_KEY).(*systemResponse.AdminUserClaim)
	return loginUser
}

func GetLoginUserId(ctx context.Context) int64 {
	user := GetLoginUserInfo(ctx)
	if user == nil {
		return 0
	}
	return user.UserId
}
