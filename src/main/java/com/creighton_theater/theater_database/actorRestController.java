package com.creighton_theater.theater_database;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/actors")
public class actorRestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/getAll")
    public List<Map<String, Object>> getAllActors() {
        String sql = "SELECT * FROM actor";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/filterBy")
    public List<Map<String, Object>> filterBy(
            @RequestParam String value) {

        try {
            String sql = "SELECT * FROM actor WHERE netID LIKE ?";

            return jdbcTemplate.queryForList(sql, new Object[] { "%" + value + "%" });
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

