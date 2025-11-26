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
@RequestMapping("/shows")
public class showRestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/getShowIDName")
    public List<Map<String, Object>> getShowIDName(@RequestParam String searchBy, @RequestParam String searchValue) {
        try {
            String sql = "SELECT showName, yearSemester, showID FROM shows WHERE " + searchBy + " LIKE ?";
            return jdbcTemplate.queryForList(sql, new Object[] { "%" + searchValue + "%" });
        } catch (Exception e) {
            return List.of();
        }
    }

}
