# Creighton Theater Database
Originally Made as a school final project, but eventually deployed on hugging face and implemented into their daily workflow. This is only to show it and to store the code, no actual functionality or local environment capabilities.

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
