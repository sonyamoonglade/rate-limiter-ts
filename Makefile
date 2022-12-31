docker-build:
	docker build -f docker/Dockerfile -t ratelimiter .
docker-run:
	./scripts/run.sh