FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

# RUN npm i -g serve

COPY . .

ARG VITE_IS_STUB
ARG VITE_API_URL

ENV VITE_IS_STUB=$VITE_IS_STUB
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# EXPOSE 8080

# CMD [ "serve", "-s", "dist" ]

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

