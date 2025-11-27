package com.creighton_theater.theater_database;

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

@RestController
@RequestMapping("/crew")
public class crewRestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/getAll")
    public List<Map<String, Object>> getAllCrew() {
        System.out.println("penis2");
        String sql = """
                        SELECT
                    c.crewID AS crewID,
                    c.firstName AS firstName,
                    c.lastName AS lastName,
                    CASE WHEN c.wigTrained = 1 THEN 'Yes' ELSE 'No' END AS wigTrained,
                    CASE WHEN c.makeupTrained = 1 THEN 'Yes' ELSE 'No' END AS makeupTrained,
                    CASE WHEN c.musicReading = 1 THEN 'Yes' ELSE 'No' END AS musicReading,
                    c.lighting AS lighting,
                    c.sound AS sound,
                    c.specialty AS specialty,
                    c.notes AS notes
                FROM crew c
                    """;
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/filterBy")
    public List<Map<String, Object>> filterBy(
            @RequestParam String value) {

        try {
            String sql = "SELECT * FROM crew WHERE crew.crewID LIKE ?";

            return jdbcTemplate.queryForList(sql, new Object[] { "%" + value + "%" });
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping("/addCrew")
    public ResponseEntity<String> addCrew(
            String crewID,
            String firstName,
            String lastName,
            Integer wigTrained,
            Integer makeupTrained,
            Integer musicReading,
            String lighting,
            String sound,
            String specialty,
            String notes) {
        String sql = "INSERT INTO crew (crewID, firstName, lastName, wigTrained, makeupTrained, musicReading, lighting, sound, specialty, notes) "
                +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            jdbcTemplate.update(sql,
                    crewID,
                    firstName,
                    lastName,
                    wigTrained != null ? wigTrained : 0,
                    makeupTrained != null ? makeupTrained : 0,
                    musicReading != null ? musicReading : 0,
                    lighting,
                    sound,
                    specialty,
                    notes);
            return ResponseEntity.ok("Crew member added successfully!");
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding crew member: " + e.getMessage());
        }
    }

}
