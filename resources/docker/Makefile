
all: middleware-up up

up:
	docker-compose --env-file .env up -d

rebuild-up:
	docker-compose --env-file .env up -d --build
	
down:
	docker-compose --env-file .env down 

clear:
	docker-compose --env-file .env down --rmi all

down-frontend-app:
	docker-compose --env-file .env down steins-frontend-app

up-frontend-app:
	docker-compose --env-file .env up -d --build steins-frontend-app




dev-up:
	docker-compose --env-file .env.dev up -d

dev-rebuild-up:
	docker-compose --env-file .env.dev up -d --build

dev-down:
	docker-compose --env-file .env.dev down

dev-clear:
	docker-compose --env-file .env.dev down --rmi all

dev-down-frontend-app:
	docker-compose --env-file .env.dev down steins-frontend-app

dev-up-frontend-app:
	docker-compose --env-file .env.dev up -d --build steins-frontend-app





middleware-clear:
	docker-compose -f docker-compose-middle.yml down --rmi all

middleware-up:
	docker-compose -f docker-compose-middle.yml --env-file .env up -d

middleware-down:
	docker-compose -f docker-compose-middle.yml --env-file .env down


