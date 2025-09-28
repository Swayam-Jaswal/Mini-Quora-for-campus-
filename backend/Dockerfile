# Use Node.js 18 LTS base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy all backend code
COPY . .

# Expose the port your backend runs on (adjust if not 5000)
EXPOSE 5000

# Command to start backend
CMD ["npm", "run", "dev"]
