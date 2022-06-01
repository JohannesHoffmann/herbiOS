FROM node:lts-alpine

LABEL author="Johannes Hoffmann"

RUN npm install forever -g

ARG env
ENV NODE_ENV=$env

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD ./build /usr/src/app/build
ADD ./node_modules /usr/src/app/node_modules

# Install app dependencies
# COPY ./package.json /usr/src/app/
# RUN npm install --production

VOLUME [ "/usr/src/app/data", "/dev/cu.usbmodem", "/tmp/shairport-sync-metadata"]

# Bundle app source
CMD [ "forever", "build/app.js" ]





