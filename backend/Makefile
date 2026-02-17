
all: env fmt build

env:
	@go version
fmt:
	go fmt .../.

# 安装swagger依赖
install-swagger:
	go install github.com/swaggo/swag/cmd/swag@latest
	go get -u -v github.com/swaggo/gin-swagger
	go get -u -v github.com/swaggo/files
	go get -u -v github.com/alecthomas/template

# 生成swagger文档
doc:
	swag init

build:
	sh build.sh steins-admin-go ./steins-core ./dist

