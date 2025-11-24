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

@RestController
@RequestMapping("/characters")
public class characterRestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

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
            String sql = "SELECT student.firstName, student.lastName, characters.showID, characterName, characters.netID, shows.showName FROM characters JOIN student ON characters.netID = student.netID JOIN shows ON characters.showID = shows.showID WHERE "
                    + page + "." + column + " LIKE ?";

            return jdbcTemplate.queryForList(sql, new Object[] { "%" + value + "%" });
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    @PostMapping("/edit")
    public String editCharacter(
            @RequestParam("NewCharacterName") String newCharacterName,
            @RequestParam("netID") String netID,
            @RequestParam("OldcharacterName") String oldCharacterName
            ) {

        String sql = "UPDATE characters SET characterName = ?, netID = ? WHERE characterName = ?";
        jdbcTemplate.update(sql, newCharacterName, netID, oldCharacterName);

        return "OK";
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addCharacter(
            @RequestParam("characterName") String characterName,
            @RequestParam("netID") String netID,
            @RequestParam("showID") String showID
) {
    Map<String, String> response = new HashMap<>();
    try {
        String sql = "INSERT INTO characters (characterName, netID, showID) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, characterName, netID, showID);

        response.put("status", "success");
        response.put("message", "Character added successfully!");
        return ResponseEntity.ok(response);
    } catch (DataAccessException e) {
        response.put("status", "error");
        response.put("message", e.getRootCause() != null ? e.getRootCause().getMessage() : e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
}