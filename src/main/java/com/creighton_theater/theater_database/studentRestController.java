package com.creighton_theater.theater_database;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
public class studentRestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    // TODO: Add student function

    // retrieves all students from database
    @GetMapping("/getAll")
    public List<Map<String, Object>> getAllStudents() {
        String sql = "SELECT * FROM student";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/filterBy")
    public List<Map<String, Object>> filterBy(String column, String value) {
        try {
            String sql = "SELECT * FROM student WHERE " + column + " LIKE ?";
            return jdbcTemplate.queryForList(sql, new Object[] { "%" + value + "%" });
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping("{netID}/edit")
    public String editStudent(
            @PathVariable String netID, // old netID from URL
            @RequestParam String newNetID,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String gradeLevel,
            @RequestParam String pronouns,
            @RequestParam String specialNotes,
            @RequestParam String email,
            @RequestParam String allergies_sensitivities) {

        String sql = """
                UPDATE student
                SET netID = ?, firstName = ?, lastName = ?, gradeLevel = ?, pronouns = ?,
                    specialNotes = ?, email = ?, allergies_sensitivities = ?
                WHERE netID = ?
                """;

        jdbcTemplate.update(sql,
                newNetID, firstName, lastName, gradeLevel, pronouns,
                specialNotes, email, allergies_sensitivities,
                netID // old
        );

        return "OK";
    }

}
