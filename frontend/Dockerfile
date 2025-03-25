FROM node:20

WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY proxy.conf.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 4200

CMD ["npm", "start"]
