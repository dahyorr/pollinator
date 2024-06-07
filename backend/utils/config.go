package utils

import (
	"log"

	"github.com/spf13/viper"
)

type ConfigInst struct {
	DatabaseURL    string `mapstructure:"DATABASE_URL"`
	SupabaseApiUrl string `mapstructure:"SUPABASE_API_URL"`
	SupabaseApiKey string `mapstructure:"SUPABASE_API_KEY"`
	JWTSecret      string `mapstructure:"SUPABASE_JWT_SECRET"`
	PORT           int    `mapstructure:"PORT"`
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
