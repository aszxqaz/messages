FROM node:20.16-alpine

WORKDIR /app

COPY /app ./app
COPY /public ./public
COPY package.json .
COPY tsconfig.json .
COPY vite.config.ts .

RUN npm i --omit=dev
RUN npm i vite
RUN npm run build

CMD [ "npm", "run", "start"]