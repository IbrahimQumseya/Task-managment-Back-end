FROM node:16 AS development

WORKDIR /ibrah/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:16 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /ibrah/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /ibrah/src/app/dist ./dist

CMD ["node", "dist/main"]

#docker build -t 