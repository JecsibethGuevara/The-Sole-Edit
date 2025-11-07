# Backend

This is the backend for the Choppi application, a NestJS-based API.

## Table of Contents

- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)

## Local Setup

This project uses Docker to simplify the local development setup.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (for running outside of Docker)

### Instructions

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  **Create an environment file:**

    Create a `.env` file in the root of the project and add the environment variables specified in the [Environment Variables](#environment-variables) section.

3.  **Run with Docker Compose:**

    ```bash
    docker-compose up -d
    ```

    This will start the NestJS application and a PostgreSQL database in Docker containers. The application will be available at `http://localhost:3000`.

## Environment Variables

The following environment variables are required. Create a `.env` file in the root of the project with the following content:

```
# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/soleditdb
```

**Note:** The `DATABASE_URL` is configured to work with the Docker Compose setup. If you are running the database separately, you will need to change this.

## Database

### Initialization

The database is automatically initialized when the Docker container starts. The `src/scripts/init.sql` file is executed, which creates the necessary tables.

### Migrations

This project does not currently use a migration tool like TypeORM migrations. Schema changes should be added to the `src/scripts/init.sql` file.

## Running the Application

You can run the application using the following npm scripts (defined in `package.json`):

-   **Development mode:**

    ```bash
    npm run start:dev
    ```

-   **Production mode:**

    ```bash
    npm run build
    npm run start:prod
    ```

-   **Tests:**

    ```bash
    npm run test
    ```

-   **Linting:**

    ```bash
    npm run lint
    ```

## Deployment

The included `Dockerfile` can be used to build a production image of the application. You can build the image with the following command:

```bash
docker build -t choppi-backend .
```

You can then run this image in a containerized environment.