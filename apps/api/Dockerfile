FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install
COPY . .
RUN npm run build:api
EXPOSE 3000
CMD ["npm", "run", "dev:api"]
