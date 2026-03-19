package storage

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

// 图床存储
type SuperBedStorage struct {
	Token string
}

type UploadResult struct {
	Err int    `json:"err"`
	Msg string `json:"msg"`
	Url string `json:"url"`
}

func (a SuperBedStorage) PutObject(file multipart.File, relativePath string) (string, error) {
	if file == nil {
		return "", fmt.Errorf("文件不能为空")
	}
	if a.Token == "" {
		return "", fmt.Errorf("聚合图床 token未配置")
	}

	bodyBuf := &bytes.Buffer{}
	formWriter := multipart.NewWriter(bodyBuf)

	// formData添加token参数
	if err := formWriter.WriteField("token", a.Token); err != nil {
		return "", fmt.Errorf("添加 token 失败：%w", err)
	}
	fileWriter, _ := formWriter.CreateFormFile("file", filepath.Base(relativePath))
	if _, err := io.Copy(fileWriter, file); err != nil {
		return "", fmt.Errorf("拷贝文件内容失败：%w", err)
	}
	// 关闭formWriter
	if err := formWriter.Close(); err != nil {
		return "", fmt.Errorf("关闭表单 writer 失败：%w", err)
	}
	req, _ := http.NewRequest("POST", "https://api.superbed.cn/upload", bodyBuf)
	req.Header.Set("Content-Type", formWriter.FormDataContentType())
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("发送上传请求失败：%w", err)
	}
	defer resp.Body.Close()
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("读取响应失败：%w", err)
	}
	var uploadResp UploadResult
	if err := json.Unmarshal(respBody, &uploadResp); err != nil {
		return "", fmt.Errorf("解析响应失败，原始响应：%s，错误：%w", respBody, err)
	}

	if uploadResp.Err != 0 {
		return "", fmt.Errorf("聚合图床上传接口调用失败：" + uploadResp.Msg)
	}
	if uploadResp.Url == "" {
		return "", fmt.Errorf("聚合图床上传接口调用失败, url为空")
	}
	return uploadResp.Url, nil
}

func (a SuperBedStorage) GetObject(relativePath string) (os.File, error) {
	var file os.File
	return file, errors.New("暂未实现")
}

func (a SuperBedStorage) GetAccessUrl(relativePath string) (string, error) {
	return "", errors.New("暂未实现")
}

func (a SuperBedStorage) RemoveFile(relativePath string) (bool, error) {
	return false, errors.New("暂未实现")
}
