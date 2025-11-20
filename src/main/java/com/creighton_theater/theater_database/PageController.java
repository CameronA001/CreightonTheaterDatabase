package com.creighton_theater.theater_database;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PageController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/student/loadpage")
    public String studentPage() {
        return "student/students";
    }

    @GetMapping("/addStudent")
    public String addStudentPage() {
        return "student/addStudents";
    }

    @GetMapping("/student/{netID}/editPage")
    public String populateEditStudentPage(@PathVariable("netID") String netID, Model model) {
        String sql = "SELECT * FROM student WHERE netID = ?";
        Map<String, Object> student = jdbcTemplate.queryForMap(sql, netID);
        model.addAttribute("student", student);
        return "student/editStudents";
    }

    @GetMapping("/")
    public String landingPage() {
        return "index";
    }

    @GetMapping("/actors/loadpage")
    public String actorsPage() {
        return "actors";
    }
}
