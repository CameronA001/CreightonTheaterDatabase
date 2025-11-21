package com.creighton_theater.theater_database;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/characters")
public class characterRestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    // retrieves all students from database
    @GetMapping("/getAll")
    public List<Map<String, Object>> getAllCharacters() {
       String sql = """
        SELECT 
        s.firstName AS firstName,
        s.lastName AS lastName,
        c.characterName AS characterName,
        c.netID AS netID,
        c.showID AS showID,
        sh.showName AS showName
            FROM characters c
            JOIN student s ON c.netID = s.netID
            JOIN shows sh ON c.showID = sh.showID
""";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/filterBy")
public List<Map<String, Object>> filterBy(
        @RequestParam String column,
        @RequestParam String value,
        @RequestParam String page) {

    try {
        String sql = "SELECT student.firstName, student.lastName, characters.showID, characterName, characters.netID, shows.showName FROM characters JOIN student ON characters.netID = student.netID JOIN shows ON characters.showID = shows.showID WHERE " + page + "." + column + " LIKE ?";

        return jdbcTemplate.queryForList(sql, new Object[] { "%" + value + "%" });
    } catch (Exception e) {
        e.printStackTrace();
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
