FROM node:18.12.1-alpine3.16 as build
WORKDIR /app
COPY package.json .
RUN npm i && mkdir build
COPY . .
RUN npm run build && \
    npm prune --production

FROM node:18.12.1-alpine3.16
WORKDIR /app
# remove yarn and npm/npx
RUN rm -rf /usr/local/lib/node_modules/npm && \
    rm -rf /opt/* && \
    touch /config.yml
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build .
EXPOSE 8000
ENTRYPOINT ["node", "/app/main.js"]
