FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY .env.production ./.env

COPY ./prisma ./prisma

RUN npm run prisma:generate

COPY . ./

EXPOSE 8080

RUN npm run build:initial

CMD ["npm", "start"]