package test

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"testing"

	"github.com/ts-gunner/forty-platform/common/storage"
)

func TestSuperBedStorage(t *testing.T) {

	st := storage.SuperBedStorage{
		Token: "",
	}
	filePath := "C:\\Users\\TS-Runner\\Downloads\\柴犬.png"
	file, _ := os.Open(filePath)
	defer file.Close()
	var fileInterface io.ReadSeeker = file
	multiFile, _ := fileInterface.(multipart.File)
	url, err := st.PutObject(multiFile, filePath)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(url)
}

func TestAliyunStorage(t *testing.T) {

	st := &storage.AliyunStorage{
		AccessKeyId:     "",
		AccessKeySecret: "",
		Region:          "cn-guangzhou",
		BucketName:      "huntingcat-store",
		AccessPrefixUrl: "aaa",
		BaseRelPath:     "/test",
	}
	st.InitClient()
	filePath := "C:\\Users\\TS-Runner\\Pictures\\1.png"
	file, _ := os.Open(filePath)
	defer file.Close()
	var fileInterface io.ReadSeeker = file
	multiFile, _ := fileInterface.(multipart.File)
	vo, err := st.PutObject(multiFile, "dog.png")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(vo)
}
