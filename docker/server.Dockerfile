
FROM node:12-slim as builder

WORKDIR /app

COPY server/package*.json ./

RUN npm install --registry=https://registry.npm.taobao.org

COPY server/ .

FROM astefanutti/scratch-node

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 80

CMD [ "node", "index.js" ] 




