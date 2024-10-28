FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./

RUN npm run build

EXPOSE 8000

CMD ["npx", "nest", "start"]