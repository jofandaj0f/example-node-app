FROM node:boron-alpine
MAINTAINER Jonathan Ferraro

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . .

#Open up containers ports app and mysql respectively
EXPOSE 3000 3306

#Start Node for NodeJS
CMD [ "npm", "start"]
