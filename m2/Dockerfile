FROM node:20

WORKDIR /app/home

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "/app/home/dist/consumer.js"]