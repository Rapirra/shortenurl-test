FROM node:18.18.2-alpine

ENV NODE_ENV production

WORKDIR /usr/src/index

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

USER node
COPY . .
EXPOSE 8090

CMD ["npm", "run", "start"]
