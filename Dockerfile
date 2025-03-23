FROM node:22-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .

EXPOSE 9000
EXPOSE 9099
EXPOSE 4000
EXPOSE 4500

CMD ["yarn", "dev"]