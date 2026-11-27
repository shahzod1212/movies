# Movie Booking

A full-stack cinema application for browsing movies and showtimes, choosing seats, and booking tickets. It includes a customer-facing React website and a Spring Boot API with an admin area for managing the movie catalogue, screening rooms, and showtimes.

## Features

- **Accounts and authentication** — register and sign in; the API issues JWT access and refresh tokens.
- **Movie catalogue** — browse paginated movies and search or filter by title, genre, studio, language, director, release date, and rating.
- **Showtimes and rooms** — view scheduled screenings, room details, and available seat information.
- **Seat selection and booking** — choose seats for a screening, create a booking, and view bookings by status.
- **Payments and tickets** — pay through Stripe Checkout; after payment confirmation, the backend generates a PDF ticket and emails it to the customer.
- **Admin tools** — manage movies, rooms, and showtimes, and view booking and screening information. Admin access requires an account with the `ADMIN` role.
- **Customer support email** — deliver support messages to the configured inbox.
- **Responsive interface** — React pages styled with Tailwind CSS, with client-side state managed by Redux Toolkit.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Redux Toolkit, Axios, Tailwind CSS |
| Backend | Java 21, Spring Boot, Spring Web MVC, Spring Security, Spring Data JPA |
| Database | MySQL |
| Integrations | Stripe Checkout, SMTP email |

## Repository layout

```text
.
├── docker-compose.yml     # Local multi-container setup
├── movie/                 # Spring Boot backend, Dockerfile, and Maven wrapper
└── movieFront/
    └── movie/             # React + Vite frontend and Dockerfile
```

## Prerequisites

- **Docker Compose:** Docker Desktop with Compose enabled.
- **Running without Docker:** Java 21, Node.js with npm, and MySQL.
- **Payments and email:** a Stripe secret key (use a test key locally) and SMTP credentials (for Gmail, use an app password).

The backend uses the Maven wrapper included in `movie/`, so a separate Maven installation is not required when running it without Docker.

## Run with Docker Compose

Make sure Docker Desktop is running. From the repository root, create your local environment file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and replace the example values with your local MySQL password, a random JWT secret of at least 32 characters, SMTP credentials, a support inbox address, and a Stripe test secret key. The example values are placeholders; email delivery and Stripe payments need valid credentials.

Build and start MySQL, the Spring Boot API, and the frontend:

```powershell
docker compose up --build
```

Open `http://localhost:5173` and sign up or log in. The API is available at `http://localhost:8080`. Use `Ctrl+C` to stop the stack; run `docker compose down` to remove its containers. MySQL data is kept in a named volume when the containers are stopped.

The backend image intentionally excludes `movie/src/main/resources/application-local.yaml`; keep local credentials in `.env`, not in an image or source commit.

## Run without Docker

### 1. Get the code and create the database

```bash
git clone https://github.com/shahzod1212/movies.git
cd movies
```

Create a MySQL database:

```sql
CREATE DATABASE movie;
```

By default, the backend connects to `jdbc:mysql://localhost:3306/movie`. You can override that URL with `DB_URL`.

### 2. Configure and start the backend

The backend reads credentials and secrets from environment variables. Set these in the same terminal that will run Spring Boot. For example, in **PowerShell**:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/movie"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your-mysql-password"
$env:JWT_SECRET = "replace-with-a-long-random-secret"
$env:MAIL_USERNAME = "your-smtp-account@example.com"
$env:MAIL_PASSWORD = "your-smtp-app-password"
$env:INBOX_EMAIL = "support@example.com"
$env:STRIPE_SECRET_KEY = "sk_test_your_stripe_secret_key"
```

Start the backend from the repository root:

```powershell
cd movie
.\mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080`. Keep this terminal open while using the app.

### 3. Install and start the frontend

Open a second terminal at the repository root:

```powershell
cd movieFront\movie
npm ci
npm run dev
```

Vite prints the local frontend URL when it starts (normally `http://localhost:5173`). Open that URL and use **Sign up** or **Log in** to access the application.

> The frontend API URL, allowed CORS origin, and Stripe return URLs are currently configured for local development (`localhost`). Update those settings before deploying to another environment.

## Configuration reference

| Variable | Purpose | Default |
| --- | --- | --- |
| `DB_URL` | JDBC URL for MySQL | `jdbc:mysql://localhost:3306/movie` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | Required |
| `JWT_SECRET` | Secret used to sign JWTs | Required |
| `MAIL_USERNAME` | SMTP account username | Required |
| `MAIL_PASSWORD` | SMTP account password/app password | Required |
| `INBOX_EMAIL` | Recipient for support messages | Required |
| `STRIPE_SECRET_KEY` | Stripe API secret key | Required |

The application configures Gmail SMTP on port `587`. Do not commit real passwords, API keys, or JWT secrets; use environment variables or a local secrets manager.

## Main application routes

| Route | Purpose |
| --- | --- |
| `/login` | Sign in |
| `/signup` | Create an account |
| `/home` | Featured movies, now showing, rooms, and movie previews |
| `/movies` | Movie catalogue |
| `/movie/:id` | Movie details |
| `/showtimes` | Showtime listings |
| `/showtime/:id` | Showtime details and booking flow |
| `/bookings` | View your bookings |
| `/admin` | Admin dashboard and catalogue/schedule management (ADMIN role required) |

Most customer pages require authentication. The backend API is served on port `8080`; the frontend currently uses that address directly.

## Development commands

Run these from `movieFront\movie`:

```bash
npm run dev       # Start the Vite development server
npm run build     # Build the frontend for production
npm run lint      # Run Oxlint
npm run preview   # Preview a production build
```

Run backend tests from `movie`:

```powershell
.\mvnw.cmd test
```
