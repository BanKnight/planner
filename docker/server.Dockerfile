FROM node:12-slim

WORKDIR /app

COPY server/package*.json ./

RUN npm install --registry=https://registry.npm.taobao.org

COPY server/ .

EXPOSE 80

CMD [ "node", "index.js" ] 




