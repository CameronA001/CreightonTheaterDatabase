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

    @GetMapping("/help")
    public String helpPage() {
        return "help";
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

    @GetMapping("/student/{netID}/shows")
    public String studentShowsPage() {
        return "student/studentShows";
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

    @GetMapping("/actor/editPage")
    public String populateEditActorPage(@RequestParam("netID") String netID, Model model) {
        String sql = """
                    SELECT
                    s.firstName AS firstName,
                    s.lastName AS lastName,
                    a.netID AS netID,
                    a.yearsActingExperience AS yearsActingExperience,
                    a.skinTone AS skinTone,
                    a.piercings AS piercings,
                    a.hairColor AS hairColor,
                    a.previousInjuries AS previousInjuries,
                    a.specialNotes AS specialNotes,
                    a.height AS height,
                    a.ringSize AS ringSize,
                    a.shoeSize AS shoeSize,
                    a.headCirc AS headCirc,
                    a.neckBase AS neckBase,
                    a.chest AS chest,
                    a.waist AS waist,
                    a.highHip AS highHip,
                    a.lowHip AS lowHip,
                    a.armseyeToArmseyeFront AS armseyeToArmseyeFront,
                    a.neckToWaistFront AS neckToWaistFront,
                    a.armseyeToArmseyeBack AS armseyeToArmseyeBack,
                    a.neckToWaistBack AS neckToWaistBack,
                    a.centerBackToWrist AS centerBackToWrist,
                    a.outsleeveToWrist AS outsleeveToWrist,
                    a.outseamBelowKnee AS outseamBelowKnee,
                    a.outseamToAnkle AS outseamToAnkle,
                    a.outseamToFloor AS outseamToFloor,
                    a.otherNotes AS otherNotes
                FROM actor a
                JOIN student s ON a.netID = s.netID
                WHERE a.netID = ?
                """;
        Map<String, Object> actor = jdbcTemplate.queryForMap(sql, netID);
        model.addAttribute("actor", actor);
        return "actor/editActor";
    }

    /*-----------------------------------------
    CREW PAGES
    -----------------------------------------*/
    @GetMapping("/crew/loadpage")
    public String crewPage() {
        return "crew/crew";
    }

    @GetMapping("/crew/add")
    public String addCrewPage() {
        return "crew/addCrew";
    }

    /*-----------------------------------------
    SHOW PAGES
    -----------------------------------------*/
    @GetMapping("/show/loadpage")
    public String showPage() {
        return "shows/shows";
    }

    @GetMapping("/show/crewInShow")
    public String crewInShowPage() {
        return "/shows/crewInShow";
    }

}