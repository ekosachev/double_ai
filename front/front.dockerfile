# FRONT DOCKERFILE
FROM node:18-alpine
WORKDIR /front
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]