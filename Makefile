CONTAINER_COMMON_NAME=todo_one
CONTAINER_APP_NAME=$(CONTAINER_COMMON_NAME)-app
CONTAINER_DB_NAME=$(CONTAINER_COMMON_NAME)-db

IMAGE_APP_NAME=3844320/$(CONTAINER_APP_NAME)
IMAGE_DB_NAME=3844320/$(CONTAINER_DB_NAME)
IMAGE_TAG=latest

build:
	docker compose -f docker-compose.yml up --build -d

run:
	docker compose -f docker-compose.prod.yml up -d

stop:
	docker stop $(CONTAINER_DB_NAME)-1 && docker rm $(CONTAINER_DB_NAME)-1
	docker stop $(CONTAINER_APP_NAME)-1 && docker rm $(CONTAINER_APP_NAME)-1

restart:
	make stop || (exit 0)
	make run

tag:
	docker tag todo_one-app:latest $(IMAGE_APP_NAME):$(IMAGE_TAG)
	docker tag mysql:8.0 $(IMAGE_DB_NAME):$(IMAGE_TAG)
	docker rmi todo_one-app:latest mysql:8.0

push:
	docker push $(IMAGE_APP_NAME):$(IMAGE_TAG)
	docker push $(IMAGE_DB_NAME):$(IMAGE_TAG)

pull:
	docker pull $(IMAGE_APP_NAME):$(IMAGE_TAG)
	docker pull $(IMAGE_DB_NAME):$(IMAGE_TAG)

redeploy:
	make pull
	make restart

check_db:
	docker exec -it todo_one-db-1 mysql -u user -p
