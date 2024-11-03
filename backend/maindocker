# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json /usr/src/app

# Install the dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . /usr/src/app

# Set environment variables
ENV PORT=5000
# ENV MONGO_URI=mongodb://localhost:27017/chatapp  # Remove this line

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]

