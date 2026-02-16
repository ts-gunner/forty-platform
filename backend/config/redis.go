package config

import "fmt"

type Redis struct {
	Port     string `mapstructure:"port" json:"port"`
	Host     string `mapstructure:"host" json:"host"`
	Password string `mapstructure:"password" json:"password"`
	DB       int    `mapstructure:"db" json:"db"`
}

func (r *Redis) Addr() string {
	if r.Host == "" {
		r.Host = "127.0.0.1"
	}
	if r.Port == "" {
		r.Port = "6379"
	}
	return fmt.Sprintf("%s:%s", r.Host, r.Port)
}
