FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Cloud Run uses PORT env, default 8080
EXPOSE 8080

CMD ["node", "index.js"]