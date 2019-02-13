FROM node:boron-alpine
MAINTAINER Jonathan Ferraro

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm -v 

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm prune

# Bundle app source
COPY . .

#Mount Shared Folder
ADD ./AsRunDrop/testFolder /DropFolder

#Open up containers ports app respectively
EXPOSE 3000

#Start Node for NodeJS
CMD [ "npm", "start"]
