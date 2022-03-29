FROM node:17-alpine3.14 AS development

WORKDIR /ibrah/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development
RUN npm uninstall bcrypt
RUN npm i bcrypt
RUN npm install pm2 -g
COPY . .

RUN npm run build

FROM node:17-alpine3.14  as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /ibrah/src/app

COPY package*.json ./

RUN npm install --only=production
RUN npm uninstall bcrypt
RUN npm i bcrypt
RUN npm install pm2 -g

COPY . .

COPY --from=development /ibrah/src/app/dist ./dist

CMD ["pm2-runtime", "dist/main"]

#docker build -t 