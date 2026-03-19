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
