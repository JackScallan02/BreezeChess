# Use a Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server code into the container
COPY . .

# Expose the server port (9001)
EXPOSE 9001

# Command to run the server
CMD ["npm", "run", "start"]
