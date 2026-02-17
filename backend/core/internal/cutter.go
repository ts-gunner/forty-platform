package internal

import (
	"os"
	"path/filepath"
	"sync"
	"time"
)

// Cutter实现io.Writer接口
/**
日志文件的文件夹组成 [director, layout, formats..., level.log]
*/
type Cutter struct {
	level    string      // 日志级别（debug, info, warn, error, dpanic, panic, fatal）
	layout   string      // 时间格式
	formats  []string    // 自定义日志文件名
	director string      // 日志文件夹
	file     *os.File    // 文件句柄
	mutex    *sync.Mutex // 读写锁
}

type CutterOption func(*Cutter)

func NewCutter(directory string, level string, options ...CutterOption) *Cutter {
	rotate := &Cutter{
		director: directory,
		level:    level,
		mutex:    new(sync.Mutex),
	}
	for i := 0; i < len(options); i++ {
		options[i](rotate)
	}
	return rotate
}

func CutterWithLayout(layout string) CutterOption {
	return func(c *Cutter) {
		c.layout = layout
	}
}
func CutterWithFormat(formats ...string) CutterOption {
	return func(c *Cutter) {
		c.formats = formats
	}
}

func (c *Cutter) Write(byte []byte) (n int, err error) {
	c.mutex.Lock()
	defer func() {
		if c.file != nil {
			_ = c.file.Close()
			c.file = nil
		}
		c.mutex.Unlock()
	}()

	length := len(c.formats)
	values := make([]string, 3+length)
	values = append(values, c.director)
	if c.layout != "" {
		values = append(values, time.Now().Format(c.layout))
	}
	for _, format := range c.formats {
		values = append(values, format)
	}
	values = append(values, c.level+".log")
	filename := filepath.Join(values...)
	director := filepath.Dir(filename)
	err = os.MkdirAll(director, os.ModePerm)
	if err != nil {
		return 0, err
	}
	// 0666： 所有人都有读写权限
	// 0644：文件所有者具有读写权限，其他的只读
	c.file, err = os.OpenFile(filename, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		return 0, err
	}
	return c.file.Write(byte)
}

func (c *Cutter) Sync() error {
	c.mutex.Lock()
	defer c.mutex.Unlock()
	if c.file != nil {
		return c.file.Sync()
	}
	return nil
}
