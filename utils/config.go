package utils

import (
	"log"

	"github.com/spf13/viper"
)

type ConfigInst struct {
	DatabaseURL     string        `mapstructure:"DATABASE_URL"`
}

var Config ConfigInst

func InitConfig() *ConfigInst {
	viper.SetConfigFile(".env")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal("Can't find the file .env : ", err)
	}
	err = viper.Unmarshal(&Config)
	if err != nil {
		log.Fatal("Environment can't be loaded: ", err)
	}
	return &Config
}
