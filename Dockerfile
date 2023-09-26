FROM --platform=linux/amd64 node:18-alpine
USER node
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json yarn.lock ./
RUN yarn install
COPY --chown=node:node . .
RUN yarn build
EXPOSE 3000
CMD [ "node", "dist/main" ]