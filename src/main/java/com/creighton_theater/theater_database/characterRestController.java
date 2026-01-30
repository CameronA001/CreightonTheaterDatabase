package com.creighton_theater.theater_database;

import java.util.Collections;
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
 * @author Cameron Abanes
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
                        s.firstname AS firstname,
                        s.lastname AS lastname,
                        c.charactername AS charactername,
                        c.netid AS netid,
                        c.showid AS showid,
                        sh.showname AS showname,
                        sh.yearsemester AS showsemester
                    FROM characters c
                    JOIN student s ON c.netid = s.netid
                    JOIN shows sh ON c.showid = sh.showid
                    ORDER BY sh.yearsemester DESC, sh.showname, c.charactername
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
            // Whitelist valid columns for each table alias
            Map<String, List<String>> validCombinations = Map.of(
                    "c", List.of("netid", "charactername"),
                    "s", List.of("firstname", "lastname"),
                    "sh", List.of("showid", "showname", "yearsemester"));

            // Validate the table alias and column
            if (!validCombinations.containsKey(page) ||
                    !validCombinations.get(page).contains(column)) {
                return ResponseEntity.badRequest().body(Collections.emptyList());
            }

            // Determine if the column is numeric
            boolean isNumeric = page.equals("sh") && column.equals("showid");

            // Build SQL with proper operator
            String operator = isNumeric ? "=" : "LIKE";

            String sql = String.format("""
                    SELECT s.firstname AS firstname,
                           s.lastname AS lastname,
                           c.charactername AS charactername,
                           c.netid AS netid,
                           c.showid AS showid,
                           sh.showname AS showname,
                           sh.yearsemester AS showsemester
                    FROM characters c
                    JOIN student s ON c.netid = s.netid
                    JOIN shows sh ON c.showid = sh.showid
                    WHERE %s.%s %s ?
                    ORDER BY sh.yearsemester DESC, sh.showname
                    """, page, column, operator);

            // Use integer value for numeric, string with % for LIKE
            Object param = isNumeric ? Integer.parseInt(value) : "%" + value + "%";

            List<Map<String, Object>> characters = jdbcTemplate.queryForList(sql, param);
            return ResponseEntity.ok(characters);

        } catch (NumberFormatException e) {
            System.err.println("Invalid numeric value: " + value);
            return ResponseEntity.badRequest().body(Collections.emptyList());
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @GetMapping("/db/ping")
    public ResponseEntity<String> pingDatabase() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return ResponseEntity.ok("DB connected, result = " + result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getClass().getName() + ": " + e.getMessage());
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
            String sql = "INSERT INTO characters (charactername, netid, showid) VALUES (?, ?, ?)";
            int showIdInt = Integer.parseInt(showID);
            jdbcTemplate.update(sql, characterName, netID, showIdInt);

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
            String sql = "UPDATE characters SET charactername = ?, netid = ? WHERE charactername = ?";
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