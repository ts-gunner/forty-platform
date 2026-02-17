package test

import (
	"fmt"
	"github.com/ts-gunner/forty-platform/common/utils"
	"testing"
)

func TestEncryptBySM3(t *testing.T) {
	s := utils.EncryptBySM3("123456")
	fmt.Println(s)
}
