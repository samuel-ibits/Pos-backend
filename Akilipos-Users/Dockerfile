FROM node:18.15.0

WORKDIR /index

COPY package.json .

RUN npm install

COPY . .

CMD ["node", "index.js"]

EXPOSE 8000