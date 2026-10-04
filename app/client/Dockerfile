# сборка статики nuxt (ssr выключен, поэтому результат обычные статические файлы)
FROM node:22-alpine AS build
WORKDIR /app
ARG NUXT_PUBLIC_API_BASE=/api
ARG NUXT_PUBLIC_WS_BASE=/
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_WS_BASE=$NUXT_PUBLIC_WS_BASE
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run generate

# раздача статики через nginx, конфиг nginx лежит отдельно в infra/nginx.conf и подключается через volume в docker-compose.yml
FROM nginx:1.27-alpine
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
