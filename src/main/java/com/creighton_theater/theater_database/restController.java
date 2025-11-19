package com.creighton_theater.theater_database;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
public class restController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    //retrieves all students from database
    @GetMapping("/getAll")
    public List<Map<String, Object>> getAllStudents() {
        String sql = "SELECT * FROM student";
        return jdbcTemplate.queryForList(sql);
    }
    
    @GetMapping("/filterBy")
    public List<Map<String, Object>> filterBy(String column, String value) {
        try{
            String sql = "SELECT * FROM student WHERE " + column + " = ?";
            return jdbcTemplate.queryForList(sql, new Object[]{value});
        }
        catch(Exception e){
            return null;
        }

    }
}


