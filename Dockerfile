FROM node:16 as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install --force

COPY . /app

RUN npm run build

FROM nginx

COPY --from=build-step /app/docs /usr/share/nginx/html

EXPOSE 4200
