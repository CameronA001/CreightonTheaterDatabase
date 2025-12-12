
package com.creighton_theater.theater_database;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Character entity operations
 * Handles CRUD operations for characters (roles played by actors in shows)
 * 
 * @author Theater Database Team
 * @version 2.0
 */
@RestController
@RequestMapping("/characters")
public class characterRestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Retrieves all characters with their show and student information
     * 
     * @return List of all characters with related data
     */
    @GetMapping("/getAll")
    public ResponseEntity<List<Map<String, Object>>> getAllCharacters() {
        try {
            String sql = """
                    SELECT
                        s.firstName AS firstName,
                        s.lastName AS lastName,
                        c.characterName AS characterName,
                        c.netID AS netID,
                        c.showID AS showID,
                        sh.showName AS showName,
                        sh.yearSemester AS showSemester
                    FROM characters c
                    JOIN student s ON c.netID = s.netID
                    JOIN shows sh ON c.showID = sh.showID
                    ORDER BY sh.yearSemester DESC, sh.showName, c.characterName
                    """;

            List<Map<String, Object>> characters = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(characters);

        } catch (DataAccessException e) {
            System.err.println("Error fetching all characters: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Filters characters by a specific column and value
     * Supports filtering across joined tables (characters, student, shows)
     * 
     * @param column The column name to filter by
     * @param value  The value to search for
     * @param page   The table alias (c=characters, s=student, sh=shows)
     * @return List of characters matching the filter criteria
     */
    @GetMapping("/filterBy")
    public ResponseEntity<List<Map<String, Object>>> filterBy(
            @RequestParam String column,
            @RequestParam String value,
            @RequestParam String page) {

        try {
            // Whitelist valid column and table combinations
            Map<String, List<String>> validCombinations = Map.of(
                    "c", List.of("netID", "characterName", "showID"),
                    "s", List.of("firstName", "lastName"),
                    "sh", List.of("showID", "showName", "yearSemester"));

            // Validate the table alias and column
            if (!validCombinations.containsKey(page) ||
                    !validCombinations.get(page).contains(column)) {
                return ResponseEntity.badRequest().body(null);
            }

            // Build SQL with validated parameters
            String sql = String.format("""
                    SELECT
                        s.firstName AS firstName,
                        s.lastName AS lastName,
                        c.characterName AS characterName,
                        c.netID AS netID,
                        c.showID AS showID,
                        sh.showName AS showName,
                        sh.yearSemester AS showSemester
                    FROM characters c
                    JOIN student s ON c.netID = s.netID
                    JOIN shows sh ON c.showID = sh.showID
                    WHERE %s.%s LIKE ?
                    ORDER BY sh.yearSemester DESC, sh.showName
                    """, page, column);

            List<Map<String, Object>> characters = jdbcTemplate.queryForList(sql, "%" + value + "%");
            return ResponseEntity.ok(characters);

        } catch (DataAccessException e) {
            System.err.println("Error filtering characters: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Adds a new character (role) to the database
     * 
     * @param characterName The name of the character/role
     * @param netID         The netID of the actor playing this role (must exist in
     *                      actor table)
     * @param showID        The ID of the show (must exist in shows table)
     * @return ResponseEntity with success or error message
     */
    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addCharacter(
            @RequestParam("characterName") String characterName,
            @RequestParam("netID") String netID,
            @RequestParam("showID") String showID) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = "INSERT INTO characters (characterName, netID, showID) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, characterName, netID, showID);

            response.put("status", "success");
            response.put("message", "Character added successfully!");
            return ResponseEntity.ok(response);

        } catch (DataIntegrityViolationException e) {
            String message = e.getRootCause() != null ? e.getRootCause().getMessage() : e.getMessage();

            response.put("status", "error");

            // Provide user-friendly error messages
            if (message != null && message.toLowerCase().contains("foreign key")) {
                response.put("message",
                        "Cannot add character: referenced netID or showID does not exist. Make sure the student exists in the actor table and the show exists.");
            } else if (message != null && message.toLowerCase().contains("duplicate")) {
                response.put("message", "This character already exists for this show");
            } else {
                response.put("message", message);
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (DataAccessException e) {
            System.err.println("Error adding character: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error adding character: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Edits a character's information
     * Note: This implementation is simplified - consider whether character name
     * should be editable
     * 
     * @param newCharacterName The new character name
     * @param netID            The netID of the actor
     * @param oldCharacterName The old character name (for lookup)
     * @return Success message
     */
    @PostMapping("/edit")
    public ResponseEntity<Map<String, String>> editCharacter(
            @RequestParam("NewCharacterName") String newCharacterName,
            @RequestParam("netID") String netID,
            @RequestParam("OldcharacterName") String oldCharacterName) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = "UPDATE characters SET characterName = ?, netID = ? WHERE characterName = ?";
            int rowsAffected = jdbcTemplate.update(sql, newCharacterName, netID, oldCharacterName);

            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Character updated successfully!");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Character not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (DataAccessException e) {
            System.err.println("Error editing character: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error editing character: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}