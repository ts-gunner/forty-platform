package utils

import (
	"context"

	"github.com/golang-jwt/jwt/v5"
	"github.com/ts-gunner/forty-platform/common/constant"
	systemResponse "github.com/ts-gunner/forty-platform/common/response/system"
)

func GetLoginUserInfo(ctx context.Context) *systemResponse.LoginUserClaim {
	loginUser := ctx.Value(constant.USER_KEY).(*systemResponse.LoginUserClaim)
	return loginUser
}

func GetLoginUserId(ctx context.Context) int64 {
	user := GetLoginUserInfo(ctx)
	if user == nil {
		return 0
	}
	return user.UserId
}

func CreateToken(claim jwt.Claims, key string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	signString, _ := token.SignedString([]byte(key))
	return signString
}
