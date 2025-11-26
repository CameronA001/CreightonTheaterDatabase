package com.creighton_theater.theater_database;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/shows")
public class showRestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/getShowName")
    public Map<String, Object> getShowName(@RequestParam String showName) {
        String sql = "SELECT showID, showName FROM shows WHERE showName LIKE ?";
        return jdbcTemplate.queryForMap(sql, showName);
    }

}
