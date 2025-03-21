FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY package*.json .
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 9000
EXPOSE 9099
EXPOSE 4000
EXPOSE 4500

CMD ["yarn", "dev"]