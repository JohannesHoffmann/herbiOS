FROM node:16-alpine

LABEL author="Johannes Hoffmann"

RUN npm install forever -g

EXPOSE 5555

ARG env
ENV NODE_ENV=$env

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD ./build /usr/src/app/build
ADD ./build /usr/src/app/assets

# Install app dependencies
COPY ./package.json /usr/src/app/
RUN npm install --production

VOLUME [ "/usr/src/app/data" ]

# Bundle app source
CMD [ "forever", "build/app.js" ]





