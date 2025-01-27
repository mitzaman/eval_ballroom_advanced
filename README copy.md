# Node.js Express Application

## Overview

This project is a Node.js Express application built using TypeScript. It serves as a microservice for calculating dance partners in a ballroom setting. The application is structured to facilitate easy maintenance and scalability.

## Project Structure

```
nodejs-express-app
├── src
│   ├── app.ts               # Entry point of the application
│   ├── controllers          # Contains controllers for handling requests
│   │   └── index.ts         # Index controller
│   ├── routes               # Contains route definitions
│   │   └── index.ts         # Route setup
│   └── types                # Type definitions
│       └── index.ts         # Custom types for requests and responses
├── Dockerfile                # Docker configuration for containerization
├── package.json              # NPM dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd nodejs-express-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Build the TypeScript files:**
   ```
   npm run build
   ```

4. **Run the application:**
   ```
   npm start
   ```

## Docker Instructions

To build and run the application in a Docker container:

1. **Build the Docker image:**
   ```
   docker build -t nodejs-express-app .
   ```

2. **Run the Docker container:**
   ```
   docker run -p 3000:3000 nodejs-express-app
   ```

## Usage

Once the application is running, you can access the API at `http://localhost:3000`. The root route will respond with a welcome message.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.