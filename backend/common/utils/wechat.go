package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/samber/lo"
)

func GetWechatOpenidByCode(appid string, secret string, code string) (string, error) {
	if appid == "" || secret == "" {
		return "", errors.New("appid or secret is empty")
	}
	url := fmt.Sprintf(
		"https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=GRANT_TYPE",
		appid, secret, code,
	)
	resp, err := http.Get(url)
	if err != nil {
		return "", errors.New("微信登录校验接口调用失败：" + err.Error())
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	var resultMap map[string]interface{}
	_ = json.Unmarshal(body, &resultMap)
	exists := lo.HasKey(resultMap, "errmsg")
	if exists {
		return "", errors.New(resultMap["errmsg"].(string))
	}
	return resultMap["openid"].(string), nil
}
