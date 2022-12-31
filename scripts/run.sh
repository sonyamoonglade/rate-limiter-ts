cfgpath=$(pwd)/config.yml
docker run -d -p 8000:8000 -v $cfgpath:/config.yml ratelimiter:latest
