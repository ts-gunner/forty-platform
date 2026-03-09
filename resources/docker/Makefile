
all: middleware-up up

up:
	docker-compose --env-file .env up -d

rebuild-up:
	docker-compose --env-file .env up -d --build
	
down:
	docker-compose --env-file .env down 

clear:
	docker-compose --env-file .env down --rmi all

dev-clear:
	docker-compose --env-file .env.dev down --rmi all

# 中间件下线并删除中间件的镜像
middleware-clear:
	docker-compose -f docker-compose-middle.yml down --rmi all

middleware-up:
	docker-compose -f docker-compose-middle.yml --env-file .env up -d

# 中间件下线
middleware-down:
	docker-compose -f docker-compose-middle.yml --env-file .env down


