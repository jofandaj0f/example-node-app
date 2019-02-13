FROM node:10.15.1-jessie
MAINTAINER Jonathan Ferraro

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm -v

#Install app dependencies
COPY . .
#COPY package.json /usr/src/app/
#COPY package-lock.json /usr/src/app
RUN npm install -g
RUN npm prune

# Bundle app source
#COPY . .

#Mount Shared Folder
ADD ./AsRunDrop/testFolder /DropFolder

#Open up containers ports app respectively
EXPOSE 3000

#Start Node for NodeJS
CMD [ "npm", "start"]
