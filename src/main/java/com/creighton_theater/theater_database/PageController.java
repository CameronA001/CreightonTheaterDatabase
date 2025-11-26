package com.creighton_theater.theater_database;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PageController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public String landingPage() {
        return "index";
    }

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

    @GetMapping("/student/{netID}/characters")
    public String showPage(@PathVariable("netID") String netID, Model model) {

        String sql = "SELECT * FROM characters WHERE netID = ?";
        List<Map<String, Object>> character = jdbcTemplate.queryForList(sql, netID);
        model.addAttribute("roles", character);
        return "characters/character";
    }


    /*-----------------------------------------
    CHARACTER PAGES
    -----------------------------------------*/
    @GetMapping("/characters/loadpage")
    public String charactersPage() {
        return "characters/character";
    }

    @GetMapping("/characters/addpage")
    public String addCharactersPage() {
        return "characters/addCharacters";
    }

    /*----------------
    ACTOR PAGES
    ----------------*/

    @GetMapping("/actors/loadpage")
    public String actorsPage() {
        return "actor/actors";
    }

    @GetMapping("/actor/add")
    public String addActorPage() {
        return "actor/addActors";
    }

    @GetMapping("/actors/editpage")
    public String editActors(){
        return "actor/editActor";
    }

    /*-----------------------------------------
    CREW PAGES
    -----------------------------------------*/
    @GetMapping("/crew/loadpage")
    public String crewPage() {
        return "crew/crew";
    }

}
