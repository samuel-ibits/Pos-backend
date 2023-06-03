FROM node:17

WORKDIR /index

COPY package.json .

RUN npm install

COPY . .

CMD ["node", "index.js"]

EXPOSE 8002