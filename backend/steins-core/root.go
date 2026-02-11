package main

import (
	"fmt"
	"github.com/spf13/cobra"
	"github.com/steins-tech/steins-admin-go/steins-common/utils/version"
	"github.com/steins-tech/steins-admin-go/steins-core/internal"
	"os"
)

var (
	configFile  string
	showVersion bool
)

func init() {
	rootCmd.PersistentFlags().StringVarP(&configFile, "config", "c", "config.yaml", "config file of steins")
	rootCmd.PersistentFlags().BoolVarP(&showVersion, "version", "v", false, "version of steins")
}

var rootCmd = &cobra.Command{
	Use:   "steins",
	Short: "steins is a server of web.(https://github.com/steins-tech/steins-platform)",
	RunE: func(cmd *cobra.Command, args []string) error {
		if showVersion {
			fmt.Println(version.Full())
			return nil
		}
		
		internal.RunServer()
		return nil
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
