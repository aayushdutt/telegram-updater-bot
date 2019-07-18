FROM node:10.13-alpine
ENV NODE_ENV production
ENV TELEGRAM_BOT_TOKEN ''
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .

CMD npm start > logs.log 2> err.log