package com.creighton_theater.theater_database;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for Crew entity operations
 * Handles CRUD operations for crew members
 * Note: Crew table references student table - crew members must be students
 * 
 * @author Cameron Abanes
 * @version 2.0
 */
@RestController
@RequestMapping("/crew")
public class crewRestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Retrieves all crew members with formatted boolean fields
     * Joins with student table to get names
     * 
     * @return List of all crew members
     */
    @GetMapping("/getAll")
    public ResponseEntity<List<Map<String, Object>>> getAllCrew() {
        try {
            String sql = """
                    SELECT
                        c.crewid AS crewid,
                        s.firstname AS firstname,
                        s.lastname AS lastname,
                        CASE WHEN c.wigtrained = true THEN 'Yes' ELSE 'No' END AS wigtrained,
                        CASE WHEN c.makeuptrained = true THEN 'Yes' ELSE 'No' END AS makeuptrained,
                        CASE WHEN c.musicreading = true THEN 'Yes' ELSE 'No' END AS musicreading,
                        c.lighting AS lighting,
                        c.sound AS sound,
                        c.specialty AS specialty,
                        c.notes AS notes
                    FROM crew c
                    JOIN student s ON c.crewid = s.netid
                    ORDER BY s.lastname, s.firstname
                    """;

            List<Map<String, Object>> crew = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(crew);

        } catch (DataAccessException e) {
            System.err.println("Error fetching all crew: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Filters crew members by crewID (which is the student's netID)
     * 
     * @param value The crewID to search for
     * @return List of crew members matching the search
     */
    @GetMapping("/filterBy")
    public ResponseEntity<List<Map<String, Object>>> filterBy(@RequestParam String value) {
        try {
            String sql = """
                    SELECT
                        c.crewid AS crewid,
                        s.firstname AS firstname,
                        s.lastname AS lastname,
                        CASE WHEN c.wigtrained = true THEN 'Yes' ELSE 'No' END AS wigtrained,
                        CASE WHEN c.makeuptrained = true THEN 'Yes' ELSE 'No' END AS makeuptrained,
                        CASE WHEN c.musicreading = true THEN 'Yes' ELSE 'No' END AS musicreading,
                        c.lighting AS lighting,
                        c.sound AS sound,
                        c.specialty AS specialty,
                        c.notes AS notes
                    FROM crew c
                    JOIN student s ON c.crewid = s.netid
                    WHERE c.crewid LIKE ?
                    ORDER BY s.lastname, s.firstname
                    """;

            List<Map<String, Object>> crew = jdbcTemplate.queryForList(sql, "%" + value + "%");
            return ResponseEntity.ok(crew);

        } catch (DataAccessException e) {
            System.err.println("Error filtering crew: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Adds a new crew member to the database
     * The crewID must correspond to an existing student's netID
     * 
     * @param crewID        The crew member's ID (must be an existing student netID)
     * @param wigTrained    Whether trained in wig work (true/false)
     * @param makeupTrained Whether trained in makeup (true/false)
     * @param musicReading  Whether can read music (true/false)
     * @param lighting      Lighting experience/notes
     * @param sound         Sound experience/notes
     * @param specialty     Special skills or focus area
     * @param notes         Additional notes
     * @return ResponseEntity with success or error message
     */
    @PostMapping("/addCrew")
    public ResponseEntity<Map<String, String>> addCrew(
            @RequestParam String crewID,
            @RequestParam(required = false) Boolean wigTrained,
            @RequestParam(required = false) Boolean makeupTrained,
            @RequestParam(required = false) Boolean musicReading,
            @RequestParam(required = false) String lighting,
            @RequestParam(required = false) String sound,
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String notes) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = """
                    INSERT INTO crew (crewid, wigtrained, makeuptrained,
                                     musicreading, lighting, sound, specialty, notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """;

            jdbcTemplate.update(sql,
                    crewID,
                    wigTrained != null ? wigTrained : false,
                    makeupTrained != null ? makeupTrained : false,
                    musicReading != null ? musicReading : false,
                    lighting,
                    sound,
                    specialty,
                    notes);

            response.put("status", "success");
            response.put("message", "Crew member added successfully!");
            return ResponseEntity.ok(response);

        } catch (DataAccessException e) {
            System.err.println("Error adding crew member: " + e.getMessage());
            response.put("status", "error");

            // Check for foreign key constraint
            if (e.getMessage().contains("foreign key")) {
                response.put("message", "Cannot add crew member: Student with netID '" + crewID + "' does not exist");
            } else if (e.getMessage().contains("Duplicate entry") || e.getMessage().contains("duplicate key")) {
                response.put("message", "Crew profile already exists for this student");
            } else {
                response.put("message", "Error adding crew member: " + e.getMessage());
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}