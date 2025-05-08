FROM node:20-alpine AS base

FROM base AS builder

WORKDIR /home/app

COPY package*.json .

RUN npm install 

COPY . .

RUN npm run build

FROM base AS runner

WORKDIR /home/app

COPY --from=builder /home/app/dist dist
COPY --from=builder /home/app/package*.json .

RUN npm install 

CMD [ "npm","run","start"]
