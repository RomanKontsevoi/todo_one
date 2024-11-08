# Этап сборки
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY . .
RUN yarn build

# Этап запуска
FROM node:20-alpine

WORKDIR /app

# Устанавливаем dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-linux-amd64-v0.6.1.tar.gz

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

EXPOSE 3000

# Используем dockerize для ожидания базы данных
CMD ["dockerize", "-wait", "tcp://db:3306", "-timeout", "30s", "node", "dist/main.js"]
