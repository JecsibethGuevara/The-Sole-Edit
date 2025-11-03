FROM node:18.20.8-alpine

WORKDIR /app

# Install necessary packages for Alpine
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && ln -sf python3 /usr/bin/python

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

EXPOSE 3000

CMD ["npm", "run", "start:dev"]