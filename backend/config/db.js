const AWS = require('aws-sdk');
const mongoose = require("mongoose");
const colors = require("colors");

AWS.config.update({ region: process.env.AWS_REGION });

// Create a Secrets Manager client
const secretsManager = new AWS.SecretsManager();

// Function to retrieve the secret from Secrets Manager
async function getSecretValue(secretName) {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        if ('SecretString' in data) {
            return JSON.parse(data.SecretString); // Parse the JSON string to an object
        }
    } catch (err) {
        console.error(`Error retrieving secret: ${err}`);
        throw err; // Handle error as needed
    }
}

const connectDB = async () => {
  try {
    //const username = encodeURIComponent(process.env.username); // Encode username
    //const password = encodeURIComponent(process.env.password); // Encode password
    const endpoint = process.env.DOCDB_ENDPOINT; // DocumentDB endpoint or instance

    //const certPath = process.env.CERT_PATH || '/usr/local/share/ca-certificates/global-bundle.pem';
    const port = 27017;

    const secretName = process.env.SECRET_NAME; // Your secret name
    const databaseName = process.env.DB_DATABASE; // Your database name

    // Retrieve the secret
    const secret = await getSecretValue(secretName);

    // Get the username and password from the secret
    const username = secret.username;
    const password = secret.password; 
    /*const username = process.env.username; // dev
    const password = process.env.password; */
    
    
    console.log("Connecting to MongoDB with the following credentials:");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`DOCDB Endpoint: ${endpoint}`);

    // Construct the connection string with database name 'chatapp'
    //const conn = await mongoose.connect(`mongodb://${username}:${password}@${endpoint}:${port}/${databaseName}`,{
    const conn = await mongoose.connect(`mongodb://${username}:${password}@${endpoint}:27017/${databaseName}?tls=true&tlsCAFile=./global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false&tlsAllowInvalidHostnames=true&directConnection=true`,
     {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: false,
      connectTimeoutMS: 10000,
      authSource: 'admin',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000, // Increase the timeout to 20 seconds
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Listen for Mongoose connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
    dbConnected = true; // Ensure this is set when connected
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
    dbConnected = false; // Reset when disconnected
});

mongoose.connection.on('error', (error) => {
    console.error(`Mongoose connection error: ${error}`);
});

module.exports = connectDB;

