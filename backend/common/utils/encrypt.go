package utils

import (
	"encoding/hex"
	"github.com/tjfoc/gmsm/sm3"
)

func EncryptBySM3(text string) string {
	h := sm3.New()
	h.Write([]byte(text))
	sum := h.Sum(nil)
	return hex.EncodeToString(sum)
}
