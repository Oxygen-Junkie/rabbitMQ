FROM node:20

WORKDIR /app/home

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["node", "/app/home/dist/server.js"]