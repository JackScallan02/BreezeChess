# Use a Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install  --frozen-lockfile

# Copy the server code into the container
COPY . .

# Expose the server port (9001)
EXPOSE 9001

# Command to run the server
CMD ["yarn", "start"]
