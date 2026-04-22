
all: network middleware-up up

network:
	docker network create platform-shared-net
# 启动容器
up:
	docker compose --env-file .env up -d

# 重新打包启动
build-up:
	docker compose --env-file .env up -d --build

# 删除容器并重新打包启动
rebuild-up: down build-up
	
down:
	docker compose --env-file .env down 

clear:
	docker compose --env-file .env down --rmi all

dev-clear:
	docker compose --env-file .env.dev down --rmi all

# 中间件下线并删除中间件的镜像
middleware-clear:
	docker compose -f docker-compose-middle.yml down --rmi all

middleware-up:
	docker compose -f docker-compose-middle.yml --env-file .env up -d

# 中间件下线
middleware-down:
	docker compose -f docker-compose-middle.yml --env-file .env down


# 清除containerd的缓存
clear-container:
	docker system prune -a

# 查看当前目录的文件夹大小
check:
	du -h --max-depth=1 .