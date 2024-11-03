# Use the official Node.js image as the base image
FROM node:20-slim

# Install required dependencies for certificates, curl (for healthchecks), and wget
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps \
    && npm cache clean --force  # Clean npm cache to reduce image size

# Copy the application code
COPY . .

# Create directory for certificates and download the certificate
RUN mkdir -p /usr/local/share/ca-certificates && \
    wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -O /usr/local/share/ca-certificates/global-bundle.pem

# Update CA certificates (optional, if required by your application)
RUN update-ca-certificates

# Set the environment variable for the certificate path
ENV CERT_PATH=/usr/local/share/ca-certificates/global-bundle.pem

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nodeuser

# Set ownership of the application files
#RUN chown -R nodeuser:nodejs /usr/src/app

# Switch to non-root user
#USER nodeuser

# Expose the application port
EXPOSE 5000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "server.js"]

