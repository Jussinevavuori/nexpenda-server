FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .env ./

COPY ./prisma ./prisma

RUN npm run prisma:generate

COPY . .

EXPOSE 5000

RUN npm run build

CMD ["npm", "start"]