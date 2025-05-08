
FROM node:20-alpine AS base


ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_EMAIL
ARG NEXT_PUBLIC_PASSWORD
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_EMAIL=$NEXT_PUBLIC_EMAIL
ENV NEXT_PUBLIC_PASSWORD=$NEXT_PUBLIC_PASSWORD


FROM base AS builder

WORKDIR /home/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM base as runner

WORKDIR /home/app

COPY package*.json ./


COPY --from=builder /home/app/.next .next
COPY --from=builder /home/app/package.json package.json
COPY --from=builder /home/app/public public
COPY --from=builder /home/app/node_modules node_modules

RUN npm install  --only=production

EXPOSE 3000

CMD ["npm", "run", "start"]