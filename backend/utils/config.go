package utils

import (
	"fmt"
	"log"
	"os"

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
	env := os.Getenv("ENV") // production or development
	if env == "" {
		env = "development"
	}
	fmt.Println("RW:", os.Getenv("ENV"))
	fmt.Println("Environment:", env)
	if env == "production" {
		viper.SetConfigName("config")
	} else {
		viper.SetConfigName("config-development")
	}
	viper.SetConfigName("config-development")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()
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
