const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const redis = require('redis');
const RedisStore = require('connect-redis').default; // Importing default export
const { promisify } = require('util');

const app = express();
const port = process.env.PORT || 2977;

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
  // set origin to a specific origin.
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
  host: process.env.HOST || 'localhost',
  user: process.env.USER || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DATABASE || 'coursework',
});

// Creating a Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS || 'redis://127.0.0.1:6379', // Update with your Redis URL
});

redisClient.connect();

redisClient.on('error', (err) => {
  console.error('Redis error: ', err);
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('end', () => {
  console.log('Redis client connection ended');
});

// Using promisify to create async functions for Redis client methods
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Creating a RedisStore instance using connect-redis
const redisStore = new RedisStore({
  client: redisClient,
});

// Middleware to use Redis for session storage
app.use(
  session({
    store: redisStore,
    secret: process.env.SECRET_KEY || 'super_duper_secret_key',
    resave: false, // Force saving the session even if unmodified
    saveUninitialized: true, // Save newly created sessions
    cookie: { secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day,
    httpOnly: process.env.PRODUCTION || false }, // Set to true for production with HTTPS
  })
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const routesDir = path.join(__dirname, 'routes');
const routeFiles = fs.readdirSync(routesDir);

for (const file of routeFiles) {
  if (file.endsWith('.js')) {
    console.log(file);
    require(path.join(routesDir, file))(app, db);
  }
}
