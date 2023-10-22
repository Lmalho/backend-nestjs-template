# Using bullseye because mongo memory server needs libcrypto.so.1.1
FROM node:18.16-bullseye  as base
# Installing "libcurl4" because some Debian images may not come with this package installed, but is required by the mongodb binaries
RUN apt-get install libcurl4
USER node
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json yarn.lock ./

FROM base as test
ENV NODE_ENV=development
RUN yarn install 
COPY --chown=node:node . .
RUN yarn jest --ci --testLocationInResults --reporters=default

FROM base as prod
RUN yarn install 
COPY --chown=node:node . .
RUN yarn build
EXPOSE 3000
CMD [ "node", "dist/main" ]