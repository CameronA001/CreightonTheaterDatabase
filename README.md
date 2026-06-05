# Creighton Theater Database
Originally Made as a school final project, but eventually deployed on hugging face and implemented into their daily workflow. 

A Spring Boot web application for managing theater data with a PostgreSQL-backed database, Thymeleaf views, and REST endpoints for actors, characters, crew, shows, and students.

## What this project uses

- Java
- Spring Boot
- Thymeleaf
- PostgreSQL (Supabase connection in the app configuration)
- Maven wrapper (`mvnw` / `mvnw.cmd`)

## Project overview

This app provides:

- a browser-based theater management interface
- REST API endpoints for core theater records
- PostgreSQL database connectivity through Spring JDBC / HikariCP
- table initialization support from `src/main/resources/schema.sql`

## Tech stack

- Spring Boot 3.5.7
- Java 25
- PostgreSQL + Supabase
- Thymeleaf
- Spring Web / JDBC

## Running locally

### 1. Prerequisites

- Java 25 or newer
- Maven wrapper included in the repository
- Access to a PostgreSQL database (the current app is configured to use a Supabase PostgreSQL connection)

### 2. Start the app

Windows (PowerShell):

```powershell
./mvnw.cmd spring-boot:run
```

macOS / Linux:

```bash
./mvnw spring-boot:run
```

### 3. Open the app

After startup, open:

```text
http://localhost:8080
```

## Database configuration

The application currently uses a PostgreSQL connection defined in `src/main/resources/application.properties`.

Typical settings look like this:

```properties
spring.datasource.url=jdbc:postgresql://<host>:5432/<database>?sslmode=require
spring.datasource.username=<username>
spring.datasource.password=<password>
spring.datasource.driver-class-name=org.postgresql.Driver
```

If you need to override the values for local testing, you can set these environment variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

## Notes

- The project uses Thymeleaf templates for the web UI.
- The app includes REST controllers for students, actors, crew, shows, and characters.
- `src/main/resources/schema.sql` is available for table setup and initialization.
