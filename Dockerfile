# Этап сборки
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN yarn install --frozen-lockfile --production

COPY . .
RUN yarn build

# Этап запуска
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]
