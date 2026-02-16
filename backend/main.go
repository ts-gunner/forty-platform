package main

import "github.com/ts-gunner/forty-platform/core"

func main() {
	initializeSystem()
	core.RunServer()
}

func initializeSystem() {
	core.Viper = core.InitViperConfig()
	
}
