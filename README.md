# Creighton Theater - Theater Database 🎭

A simple Spring Boot web app to manage theater shows, students, actors, characters, and crew.
This README explains how to set up the project on a Windows machine with a local MySQL server and how to run it — written for non-technical or beginner users.

---

## ✅ What you’ll need

- A Windows or macOS computer (this guide includes instructions for both)
- Git (to clone the repository) — https://git-scm.com/
- Java JDK (the project uses **Java 25** as set in the project; install the matching JDK) — https://adoptium.net/ (macOS users can also install via Homebrew: `brew install --cask temurin`)
- MySQL Server installed and running locally — Windows: https://dev.mysql.com/downloads/mysql/; macOS: install via Homebrew `brew install mysql`
- A web browser (Chrome, Edge, Firefox)

> Tip: You do not need to install Maven because this project includes the Maven wrapper (`mvnw` / `mvnw.cmd`). On macOS use `./mvnw`, on Windows use `.\mvnw.cmd`.

---

## 🛠️ Install Java and MySQL (step-by-step)

Follow the steps below if you haven't installed Java or MySQL yet.

Windows - Java (Adoptium or installer):
1. Visit https://www.oracle.com/java/technologies/downloads/ and download the windows x64 installer. 
2. Run the installer and follow prompts.
3. Set `JAVA_HOME` in System Properties → Environment Variables to the JDK installation folder, and add `%JAVA_HOME%\bin` to `PATH` if the installer did not do so.

Windows - MySQL:
1. Visit https://dev.mysql.com/downloads/mysql/ and download the MySQL Installer for Windows.
2. Run the installer, follow prompts, and configure a root password when requested.
3. Start MySQL from Windows Services or MySQL Workbench.

macOS - Java (Homebrew):
```bash
# Install Homebrew if you don't have it: https://brew.sh/
brew install --cask temurin
# Verify Java is installed
java -version
```

macOS - MySQL (Homebrew):
```bash
brew install mysql
brew services start mysql
# Secure installation (set root password and remove test user)
mysql_secure_installation
```

After installing, you can check MySQL by running `mysql -u root -p` and entering the password you set.

---

---

## 📥 Step 1 — Clone the repository

Windows (PowerShell):

1. Open PowerShell.
2. Choose (or create) a folder where you want the project.
3. Run:

```powershell
# replace <repo-url> with the actual GitHub link for this project
git clone <repo-url>
cd theater_db
```

macOS (Terminal):

1. Open Terminal (Applications → Utilities → Terminal).
2. Choose (or create) a folder where you want the project.
3. Run:

```bash
# replace <repo-url> with the actual GitHub link for this project
git clone <repo-url>
cd theater_db
```

---

## 🗄 Step 2 — Set up MySQL (local)

The app looks for a database named `creightontheater` by default.

1. Start MySQL Server (if it is not running).
   - You can use MySQL Workbench or Windows Services to start the MySQL service.
2. Open a MySQL shell (or Workbench query window):

```powershell
mysql -u root -p
# Enter the root password when prompted
```

3. In the MySQL prompt, create the database (copy and paste):

```sql
CREATE DATABASE creightontheater CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. (Optional / recommended) Create a non-root user and give it access to this database:

```sql
CREATE USER 'theater'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON creightontheater.* TO 'theater'@'localhost';
FLUSH PRIVILEGES;
```

5. The app's default connection settings are in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/creightontheater
spring.datasource.username=root
spring.datasource.password=yourPassword
```

If you use a different username/password, edit `application.properties` or set the corresponding environment variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

> Note: The project contains `src/main/resources/schema.sql`. On startup the app will run any initialization SQL found there to create tables.

---

## ▶️ Step 3 — Run the app

Windows (PowerShell):

From the project root, run one of these commands in PowerShell:

Option A — Quick run (recommended for dev):

```powershell
# Use the Maven wrapper for immediate run
.\mvnw.cmd spring-boot:run
```

Option B — Build then run the JAR:

```powershell
.\mvnw.cmd package
# then
java -jar target\theater_database-0.0.1-SNAPSHOT.jar
```

macOS (Terminal):

From the project root, run one of these commands in Terminal:

Option A — Quick run (recommended for dev):

```bash
# Make sure mvnw is executable the first time: chmod +x mvnw
./mvnw spring-boot:run
```

Option B — Build then run the JAR:

```bash
./mvnw package
# then
java -jar target/theater_database-0.0.1-SNAPSHOT.jar
```

Notes:

- If Java is not found, install a JDK and ensure `JAVA_HOME` is set correctly and on your PATH.
- If you changed DB credentials use environment variables before starting the app (Windows PowerShell example):

```powershell
$env:SPRING_DATASOURCE_USERNAME = "theater"
$env:SPRING_DATASOURCE_PASSWORD = "your_password_here"
.\mvnw.cmd spring-boot:run
```

macOS (bash/zsh):

```bash
export SPRING_DATASOURCE_USERNAME=theater
export SPRING_DATASOURCE_PASSWORD=your_password_here
./mvnw spring-boot:run
```

If everything starts successfully, you should see Spring Boot logs in the terminal and a line similar to `Started TheaterDatabaseApplication in ...`.

---

## 🌐 Step 4 — Open in your browser

Open your browser and navigate to:

```
http://localhost:8080
```

Example pages (direct links after starting the app):

- Home: `/` → `http://localhost:8080/`
- Actors: `/actors/loadpage` → `http://localhost:8080/actors/loadpage`
- Characters: `/characters/loadpage`
- Crew: `/crew/loadpage`
- Shows: `/show/loadpage`
- Students list: `/student/loadpage`

---

## ⚙️ Troubleshooting 🛠️

Common problems and how to fix them.

1. Cannot connect to the database (errors mentioning `Communications link failure` or `Access denied`):

   - Make sure MySQL server is running.
   - Confirm the database `creightontheater` exists: `SHOW DATABASES;` in MySQL shell.
   - If you see `Access denied for user 'root'@'localhost'`, check the username/password in `src/main/resources/application.properties` or set environment variables as shown earlier.
   - If you created a non-root user (recommended), ensure you used `GRANT ALL PRIVILEGES ON creightontheater.*` and `FLUSH PRIVILEGES;`.

2. `java: command not found` or the app fails to start because of Java errors:

   - Install a compatible JDK (Java 25 for this project) and set `JAVA_HOME`.
   - On Windows: set `JAVA_HOME` in System Properties and restart your terminal.
   - On macOS (bash/zsh): add `export JAVA_HOME=$(/usr/libexec/java_home)` to your shell profile and reopen Terminal.

3. Port 8080 already in use:

   - Either stop the process using 8080 (e.g., close the program) or change the app port by adding `server.port=YOUR_PORT` to `src/main/resources/application.properties` and restart.

4. `Permission denied` when running `./mvnw` on macOS:

   - Make the wrapper executable once: `chmod +x mvnw`.

5. Schema or tables not created on startup:

   - `src/main/resources/schema.sql` will run on start if Spring is configured to initialize SQL (this project has `spring.sql.init.mode=always`). Check logs for SQL errors and ensure the DB user has CREATE TABLE permissions.

6. I changed credentials but the app still uses old settings:
   - Make sure you restarted the app after changing `application.properties` or set environment variables for your terminal session before running the app.

If you still have problems, copy the exact error message and open an issue in the repo (or ask for help) — I can help interpret logs and suggest fixes.

---

## 🔧 Want to change settings instead of editing files? (Environment variables)

You can override properties with environment variables. For example (PowerShell):

```powershell
$env:SPRING_DATASOURCE_USERNAME = "theater"
$env:SPRING_DATASOURCE_PASSWORD = "your_password_here"
.\mvnw.cmd spring-boot:run
```

---

## 💡 Helpful tips

- The app is intended for use on a local machine for development or demonstration.
- If you are unsure about editing files or running commands, ask someone comfortable with basic terminal commands — this README is written to help you follow along step-by-step.

---

If something doesn't work or you want me to add screenshots or a short video walkthrough, open an issue or ask for help in the project's GitHub repository. ✅

---

**Enjoy exploring the Creighton Theater database!** 🎭
