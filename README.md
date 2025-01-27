# Ballroom Dance Partner Calculation Microservice

This microservice calculates the average number of dance partners a person gets in a ballroom scenario based on provided constraints.

## Prerequisites
- Node.js (>=18.x)
- npm or yarn
- Docker (optional for containerization)

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd ballroom-microservice
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Running the API

### Development Mode
```sh
npm run dev
```
The server will start on `http://localhost:5000`

### Production Mode
```sh
npm run build
npm start
```

## API Endpoints

### Calculate Dance Partners
**POST** `/calculate-partners`

#### Request Body (JSON):
```json
{
  "total_leaders": 3,
  "total_followers": 3,
  "dance_styles": ["Waltz", "Tango", "Foxtrot"],
  "leader_knowledge": {
    "1": ["Waltz", "Tango"],
    "2": ["Foxtrot"],
    "3": ["Waltz", "Foxtrot"]
  },
  "follower_knowledge": {
    "A": ["Waltz", "Tango", "Foxtrot"],
    "B": ["Tango"],
    "C": ["Waltz"]
  },
  "dance_duration_minutes": 50
}
```

#### Response:
```json
{
  "average_partners": 2
}
```
### Get Dance Preferences

**GET** `/dance-preferences`

Returns the most and least popular dance types from the data stored in the dance_sessions table.

#### Response:
```json
{
  "most_popular": {
    "style": "Waltz",
    "usage_count": "14"
  },
  "least_popular": {
    "style": "Foxtrot",
    "usage_count": "2"
  }
}
```
## Running Tests

To run Jest tests:

```sh
npm install --save-dev jest @types/jest ts-jest

npm test
```

## Running with Docker
1. Build the Docker image:
   ```sh
   docker build -t ballroom-microservice .
   ```
2. Run the container:
   ```sh
   docker run -p 5000:5000 ballroom-microservice
   ```
The service will be available at `http://localhost:5000`.

