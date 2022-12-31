FROM node:18.12.1-alpine3.16 as build
WORKDIR /app
COPY package.json .
RUN npm i && mkdir build
COPY . .
RUN npm run build
FROM node:18.12.1-alpine3.16
WORKDIR /app
COPY package.json .
COPY config.yml .
RUN npm i
COPY --from=build /app/build /app/build
EXPOSE 8000
ENV NODE_ENV=production
ENTRYPOINT ["npm", "run", "start:prod"]
