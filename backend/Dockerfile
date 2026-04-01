# backend/Dockerfile

FROM node:lts-buster-slim

# Set working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install just production deps
RUN npm ci --only=production

# Copy app code
COPY . .

# Expose backend port (as defined in your app)
EXPOSE 5000

# Start backend
CMD ["node", "server.js"]