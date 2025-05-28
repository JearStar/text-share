FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]