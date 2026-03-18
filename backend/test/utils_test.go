package test

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/ts-gunner/forty-platform/common/utils"
)

func TestEncryptBySM3(t *testing.T) {
	s := utils.EncryptBySM3("123456")
	fmt.Println(s)
}

func TestWechatVerifyLogin(t *testing.T) {
	appid := ""
	secret := ""
	code := "0e3m65ll2iQznh4XBRol2db9hl4m65l1"
	result, _ := utils.GetWechatOpenidByCode(appid, secret, code)
	var resultMap map[string]interface{}
	_ = json.Unmarshal([]byte(result), &resultMap)
	fmt.Println(resultMap)
}
