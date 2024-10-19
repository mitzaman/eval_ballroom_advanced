# Advanced Ballroom Dancing AI Microservice Challenge

## Introduction

In this challenge, you will design and develop a microservice that merges AI-driven technology with ballroom dancing logistics. Your task is to create a RESTful API, containerized with Docker, complemented by well-written tests and clear documentation. This version introduces a calculation component for determining how many dance partners a person gets to dance with on average in a ballroom with specific constraints.

### Key Requirements

- **Language**: Choose Golang, TypeScript, Java, or Rust.
- **API**: A single RESTful POST endpoint.
- **Docker**: Containerize the microservice.
- **Testing**: Implement meaningful tests to cover various scenarios and edge cases.
- **Documentation**: Provide detailed instructions in `README.md`.

### The Challenge: AI-Powered Dance Partner Calculation

Create a REST API with a single POST endpoint that calculates the average number of different dance partners each participant will dance with based on specific inputs.

- **Endpoint**: `POST /calculate-partners`
  
  **Request Body** (JSON):
  ```json
  {
    "total_leaders": 10,
    "total_followers": 15,
    "dance_styles": ["Waltz", "Tango", "Foxtrot"],
    "leader_knowledge": {
      "1": ["Waltz", "Tango"],
      "2": ["Foxtrot"],
      "3": ["Waltz", "Foxtrot"],
      ...
    },
    "follower_knowledge": {
      "A": ["Waltz", "Tango", "Foxtrot"],
      "B": ["Tango"],
      "C": ["Waltz"],
      ...
    },
    "dance_duration_minutes": 120
  }
  ```

- **Logic**:
  - **Leaders and Followers**: The `total_leaders` and `total_followers` fields represent the number of people in each role.
  - **Dance Styles**: A list of dance styles available in the ballroom (e.g., "Waltz", "Tango", "Foxtrot").
  - **Knowledge**: Each leader and follower knows specific dances, represented by the `leader_knowledge` and `follower_knowledge` fields. Each participant can only dance with others who know the same dance style.
  - **Dance Duration**: The total duration of the ballroom event, in minutes.

  **Assumptions**:
  - Each dance takes an average of 5 minutes, including partner switching time.
  - Leaders and followers can only dance with partners who know at least one dance style in common.
  - For each dance session, available leaders and followers are randomly matched based on their common knowledge of a dance style.

  **Formula** (example logic):
  - Calculate the total number of possible dances in the given time.
  - For each dance, randomly match leaders and followers who know the same style.
  - Calculate how many unique partners each participant gets to dance with on average, based on how often their known dances align with others.

- **Response** (JSON):
  ```json
  {
    "average_dance_partners": 8
  }
  ```

### Docker

- Provide a Dockerfile to containerize the service.
- Include instructions for building and running the container.

### Testing

- Write tests to verify the API's functionality, including edge cases (e.g., no common dances, large differences in the number of leaders and followers).
- Include clear instructions to run the test in the documentation.

### Documentation

Your `README.md` should cover:

1. Setup instructions.
2. Design rationale.
3. Example usage of the API with different input parameters.

## Evaluation Criteria

- **Code Quality**: Clean, efficient, maintainable code.
- **Functionality**: The API performs as expected, calculating realistic and dynamic averages based on the input.
- **Testing**: The tests should cover different scenarios, from ideal to edge cases, and be well-structured.
- **Documentation**: Clear and concise, covering all necessary steps.

## Bonus: Track Dance Preferences

### Additional Task

Track and analyze the popularity of different dance styles based on how often they are danced during the session. Store this data in a database and provide an endpoint to retrieve the most and least popular dance styles.

- **New Endpoint**: `GET /dance-preferences`
  - Return the most popular and least popular dance styles from the session.

- **Database**: Store the number of dances performed for each style during the session.

### Documentation

Expand the `README.md` to include:

1. Explanation of the new `dance-preferences` endpoint.
2. Example responses showing popular and least popular styles.

## Submission

- Host your code on a public platform (e.g., GitHub).
- Ensure the repository is accessible for review.
- Alternatively, zip and send your archive to the email provided during your interview.
