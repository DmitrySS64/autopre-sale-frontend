FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

# RUN npm i -g serve

COPY . .

RUN npm run build

# EXPOSE 8080

# CMD [ "serve", "-s", "dist" ]

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

