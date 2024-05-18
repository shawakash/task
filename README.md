# User List Management and Email Sending API

## Overview

This project is a RESTful API for managing user lists with customizable properties and sending emails to users. The API supports creating lists, adding users via CSV uploads, and sending emails with custom property placeholders.

## Features

1. **List Creation**: Admin can create a list with a title and custom properties -> `/list/create` endpoint.
2. **User Addition**: Admin can add users to the list via CSV upload -> `/list/upload?listId=123` endpoint.
3. **CSV Format**: Supports CSV with required headers `name` and `email`, along with custom properties.
4. **Unique Emails**: Ensures no duplicate emails within a list.
5. **Error Handling**: Provides feedback on users not added due to errors.
6. **Bonus Features**:
   - Send emails to all users in a list with a subject and emailBody -> `/mail/send` endpoint.
   - Custom properties as placeholders in email body.
   - Unsubscribe link to remove users from the mailing list.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Message Queue (e.g., Kakfka) for robustness and scalability.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Message Queue (e.g., Kafka)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shawakash/task.git
   cd task
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables for task. Create a `.env` file in the backend/task directory and add the following:

   ```env
   MONGODB_URI=mongodb://localhost:27017/userlist
   ```

4. Set up environment variables for worker. Create a `.env` file in the backend/worker directory and add the following:

   ```env
   GMAIL_APP_PASS=your_app_password
   GMAIL=dev.payBox@gmail.com
   MAIL_SERVICE=gmail
   MONGODB_URI=mongodb://localhost:27017/userlist
   ```

5. Start the Kafka Service Locally:

   ```bash
   cd docker/kafka
   docker-compose up -d
   cd ../..
   ```

6. Start the Worker Service:

   ```bash
   cd backend/worker
   yarn dev
   ```

7. Start the task backend:
   ```bash
   cd backend/task
   yarn dev
   ```

### API Documentation

API documentation is available via Postman. Import the provided Postman collection to explore and test the API endpoints.

## Endpoints

### List Endpoints

- **Create List**

  - **POST** `/list/create`
  - **Body**: `{ "title": "User2", "customProperties": [{"title": "city", "defaultValue": "Barcelone"}, {"title": "state", "defaultValue": "Spain"}]}`

- **Upload CSV**

  - **POST** `/list/upload?listId=123`
  - **FORMDATA**: CSV file with file name as `file` and contents as .csv file.

### User Endpoints

- **SEND MAIL**
  - **POST** `/mail/send`
  - **Body**: `{ "subject": "Email Subject", "emailBody": "Hey [name]!\nThank you for signing up with your email [email]. We have received your city as [city], [state].\nTeam MathonGo.", "listId": "123" }`

## Error Handling

The API provides detailed error messages for invalid requests. When adding users via CSV, the response includes a summary of successes and failures, along with details for each failed record.

## Scalability

- Efficient CSV processing for large files (10,000+ records).
- Integration with a message queue for sending emails to ensure robustness.
- Can be deployed to kub8s for high scalablity.

## Unsubscribe Feature

Each email contains an unsubscribe link. Clicking this link will unsubscribe the user from the list, preventing them from receiving future emails from that list.

## Deployment

The application can be deployed on any cloud provider. Ensure the environment variables are set appropriately for the production environment.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
