package database

import (
	"github.com/dahyorr/pollinator/utils"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DB *sqlx.DB

func Init(config *utils.ConfigInst) error {
	var err error
	DB, err = sqlx.Connect("postgres", config.DatabaseURL)
	return err
}
