# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build TypeScript files
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]
