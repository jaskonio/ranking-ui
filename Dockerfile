FROM node:20-buster-slim AS build-stage

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build --prod

RUN rm package.json package-lock.json


FROM nginx:1.26.0-alpine AS production-stage

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist/ranking-ui/browser /usr/share/nginx/html

EXPOSE 80
