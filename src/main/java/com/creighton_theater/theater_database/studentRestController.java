package com.creighton_theater.theater_database;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Student entity operations
 * Handles CRUD operations for students in the theater database
 * 
 * @author Cameron Abanes
 * @version 2.0
 */
@RestController
@RequestMapping("/student")
public class studentRestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Retrieves all students from the database
     * 
     * @return List of all students with their information
     */
    @GetMapping("/getAll")
    public ResponseEntity<List<Map<String, Object>>> getAllStudents() {
        try {
            String sql = "SELECT * FROM student ORDER BY lastName, firstName";
            List<Map<String, Object>> students = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(students);
        } catch (DataAccessException e) {
            // Log the error (in production, use proper logging framework)
            System.err.println("Error fetching all students: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Filters students by a specific column and value
     * Uses parameterized queries to prevent SQL injection
     * 
     * @param column The column name to filter by (netID, firstName, lastName,
     *               gradeLevel, allergies_sensitivities)
     * @param value  The value to search for (supports partial matches with LIKE)
     * @return List of students matching the filter criteria
     */
    @GetMapping("/filterBy")
    public ResponseEntity<List<Map<String, Object>>> filterBy(
            @RequestParam String column,
            @RequestParam String value) {

        try {
            // Whitelist allowed columns to prevent SQL injection
            List<String> allowedColumns = List.of(
                    "netID", "firstName", "lastName", "gradeLevel",
                    "pronouns", "specialNotes", "email", "allergies_sensitivities");

            if (!allowedColumns.contains(column)) {
                return ResponseEntity.badRequest().body(null);
            }

            // Use parameterized query - column name is validated above
            String sql = String.format("SELECT * FROM student WHERE %s LIKE ? ORDER BY lastName, firstName", column);
            List<Map<String, Object>> students = jdbcTemplate.queryForList(sql, "%" + value + "%");

            return ResponseEntity.ok(students);
        } catch (DataAccessException e) {
            System.err.println("Error filtering students: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Retrieves all shows that a student has been in (as an actor)
     * API endpoint for fetching show data as JSON
     * 
     * @param netID The student's netID
     * @return List of shows with character information
     */
    @GetMapping("/getShows")
    public ResponseEntity<List<Map<String, Object>>> getStudentShows(@RequestParam String netID) {
        try {
            String sql = """
                    SELECT DISTINCT
                        s.showID,
                        s.showName,
                        s.yearSemester,
                        s.director,
                        s.genre,
                        s.playWright,
                        GROUP_CONCAT(c.characterName SEPARATOR ', ') AS characters
                    FROM shows s
                    JOIN characters c ON s.showID = c.showID
                    WHERE c.netID = ?
                    GROUP BY s.showID, s.showName, s.yearSemester, s.director, s.genre, s.playWright
                    ORDER BY s.yearSemester DESC, s.showName
                    """;

            List<Map<String, Object>> shows = jdbcTemplate.queryForList(sql, netID);
            return ResponseEntity.ok(shows);

        } catch (DataAccessException e) {
            System.err.println("Error fetching student shows: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Adds a new student to the database
     * 
     * @param netID        Student's unique network ID (required)
     * @param firstName    Student's first name (required)
     * @param lastName     Student's last name (required)
     * @param gradeLevel   Student's grade level (required)
     * @param pronouns     Student's pronouns (optional)
     * @param specialNotes Any special notes about the student (optional)
     * @param email        Student's email address (optional)
     * @param allergies    Allergies or sensitivities (optional)
     * @return ResponseEntity with success or error message
     */
    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addStudent(
            @RequestParam String netID,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String gradeLevel,
            @RequestParam(required = false, defaultValue = "") String pronouns,
            @RequestParam(required = false, defaultValue = "") String specialNotes,
            @RequestParam(required = false, defaultValue = "") String email,
            @RequestParam(required = false, defaultValue = "") String allergies) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = """
                    INSERT INTO student (netID, firstName, lastName, gradeLevel, pronouns,
                                       specialNotes, email, allergies_sensitivities)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """;

            jdbcTemplate.update(sql, netID, firstName, lastName, gradeLevel,
                    pronouns, specialNotes, email, allergies);

            response.put("status", "success");
            response.put("message", "Student added successfully!");
            return ResponseEntity.ok(response);

        } catch (DataAccessException e) {
            System.err.println("Error adding student: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error adding student: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Edits an existing student's information
     * Allows changing the netID (primary key) by using the path variable as the old
     * netID
     * 
     * @param netID                   The current/old netID from the URL path
     * @param newNetID                The new netID (can be same as old if not
     *                                changing)
     * @param firstName               Updated first name
     * @param lastName                Updated last name
     * @param gradeLevel              Updated grade level
     * @param pronouns                Updated pronouns
     * @param specialNotes            Updated special notes
     * @param email                   Updated email
     * @param allergies_sensitivities Updated allergies/sensitivities
     * @return ResponseEntity with success or error message
     */
    @PostMapping("/{netID}/edit")
    public ResponseEntity<Map<String, String>> editStudent(
            @PathVariable String netID,
            @RequestParam String newNetID,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String gradeLevel,
            @RequestParam(required = false, defaultValue = "") String pronouns,
            @RequestParam(required = false, defaultValue = "") String specialNotes,
            @RequestParam(required = false, defaultValue = "") String email,
            @RequestParam(required = false, defaultValue = "") String allergies_sensitivities) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = """
                    UPDATE student
                    SET netID = ?, firstName = ?, lastName = ?, gradeLevel = ?, pronouns = ?,
                        specialNotes = ?, email = ?, allergies_sensitivities = ?
                    WHERE netID = ?
                    """;

            int rowsAffected = jdbcTemplate.update(sql,
                    newNetID, firstName, lastName, gradeLevel, pronouns,
                    specialNotes, email, allergies_sensitivities,
                    netID); // This is the old netID from the path

            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Student updated successfully!");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Student not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (DataAccessException e) {
            System.err.println("Error editing student: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error editing student: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Deletes a student from the database
     * Note: This will fail if the student has related records (actors, crew,
     * characters)
     * due to foreign key constraints
     * 
     * @param netID The netID of the student to delete
     * @return ResponseEntity with success or error message
     */
    @PostMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteStudent(@RequestParam String netID) {
        Map<String, String> response = new HashMap<>();

        try {
            String sql = "DELETE FROM student WHERE netID = ?";
            int rowsAffected = jdbcTemplate.update(sql, netID);

            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Student deleted successfully!");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Student not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (DataAccessException e) {
            System.err.println("Error deleting student: " + e.getMessage());
            response.put("status", "error");

            // Check if it's a foreign key constraint violation
            if (e.getMessage().contains("foreign key")) {
                response.put("message",
                        "Cannot delete student: they have related records (characters, actor profile, or crew assignments)");
            } else {
                response.put("message", "Error deleting student: " + e.getMessage());
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}