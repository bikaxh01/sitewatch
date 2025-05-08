FROM node:20-alpine AS base

FROM base AS builder

WORKDIR /home/build

COPY package*.json ./
RUN npm install

COPY . .

# Pass environment variables before build
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL="https://be.sitewatch.tech/api" 
ARG NEXT_PUBLIC_EMAIL
ENV NEXT_PUBLIC_EMAIL="testUser@gmail.com" 
ARG NEXT_PUBLIC_PASSWORD
ENV NEXT_PUBLIC_PASSWORD="12345678" 

RUN npm run build

FROM base AS runner

WORKDIR /home/app

COPY package*.json ./


COPY --from=builder /home/build/.next .next
COPY --from=builder /home/build/package.json package.json
COPY --from=builder /home/build/public public
COPY --from=builder /home/build/node_modules node_modules

RUN npm install  

EXPOSE 3000

CMD ["npm", "run", "start"]