FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 9000
EXPOSE 9099
EXPOSE 4000
EXPOSE 4500

CMD ["npm", "run", "dev"]