package com.creighton_theater.theater_database;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
public class studentRestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

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
    public String editStudent(String netID, String firstName, String lastName, String gradeLevel, String pronouns,
            String specialNotes, String email, String allergies) {
        String sql = "UPDATE student SET firstName = ?, lastName = ?, gradeLevel = ?, pronouns = ?, specialNotes = ?, email = ?, allergies_sensitivities = ? WHERE netID = ?";
        jdbcTemplate.update(sql, firstName, lastName, gradeLevel, pronouns, specialNotes, email, allergies, netID);
        return "OK";
    }

    @PostMapping("/delete")
    public String deleteStudent(String netID) {
        String sql = "DELETE FROM student WHERE netID = ?";
        jdbcTemplate.update(sql, netID);
        return "OK";
    }

    @PostMapping("/add")
    public String addStudent(String netID, String firstName, String lastName, String gradeLevel, String pronouns,
            String specialNotes, String email, String allergies) {
        String sql = "INSERT INTO student (netID, firstName, lastName, gradeLevel, pronouns, specialNotes, email, allergies_sensitivities) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, netID, firstName, lastName, gradeLevel, pronouns, specialNotes, email, allergies);
        return "OK";
    }

}
