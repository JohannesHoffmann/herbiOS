FROM node:10-alpine

RUN npm install serve -g

# Create app directory
RUN mkdir -p /usr/src/app
ADD ./build /usr/src/app
WORKDIR /usr/src/app

ARG env
ENV NODE_ENV=$env

EXPOSE 3000

# Bundle app source
CMD [ "serve", "-s" ]