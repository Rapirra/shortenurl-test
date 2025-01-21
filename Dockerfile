FROM node:20 as base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

FROM base as production

ENV NODE_PATH=./dist

RUN npm run build
