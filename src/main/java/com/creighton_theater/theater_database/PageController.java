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
        String sql = "SELECT * FROM student WHERE netid = ?";
        Map<String, Object> student = jdbcTemplate.queryForMap(sql, netID);
        model.addAttribute("student", student);
        return "student/editStudents";
    }

    @GetMapping("/student/{netID}/characters")
    public String showPage(@PathVariable("netID") String netID, Model model) {
        String sql = "SELECT * FROM characters WHERE netid = ?";
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

    @GetMapping("/characters/editPage")
    public String editCharacterPage() {
        return "characters/editCharacter";
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
                    s.firstname AS firstname,
                    s.lastname AS lastname,
                    a.netid AS netid,
                    a.yearsactingexperience AS yearsactingexperience,
                    a.skintone AS skintone,
                    a.piercings AS piercings,
                    a.haircolor AS haircolor,
                    a.previousinjuries AS previousinjuries,
                    a.specialnotes AS specialnotes,
                    a.height AS height,
                    a.ringsize AS ringsize,
                    a.shoesize AS shoesize,
                    a.headcirc AS headcirc,
                    a.neckbase AS neckbase,
                    a.chest AS chest,
                    a.waist AS waist,
                    a.highhip AS highhip,
                    a.lowhip AS lowhip,
                    a.armseyetoarmseyefront AS armseyetoarmseyefront,
                    a.necktowaistfront AS necktowaistfront,
                    a.armseyetoarmseyeback AS armseyetoarmseyeback,
                    a.necktowaistback AS necktowaistback,
                    a.centerbacktowrist AS centerbacktowrist,
                    a.outsleevetowrist AS outsleevetowrist,
                    a.outseambelowknee AS outseambelowknee,
                    a.outseamtoankle AS outseamtoankle,
                    a.outseamtofloor AS outseamtofloor,
                    a.othernotes AS othernotes
                FROM actor a
                JOIN student s ON a.netid = s.netid
                WHERE a.netid = ?
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

    @GetMapping("/show/scenesInShow")
    public String scenesInShowPage() {
        return "/shows/scenesInShow";
    }

    @GetMapping("/show/sceneDetails")
    public String sceneDetailsPage() {
        return "/shows/sceneDetails";
    }

    @GetMapping("/show/add")
    public String addShowPage() {
        return "shows/addShow";
    }

    @GetMapping("/show/addScene")
    public String addScenePage() {
        return "shows/addScene";
    }

    @GetMapping("/show/editScene")
    public String editScenePage() {
        return "shows/editScene";
    }

    @GetMapping("/show/addSceneDetails")
    public String addSceneDetailsPage() {
        return "shows/addSceneDetails";
    }

    @GetMapping("/show/editSceneDetails")
    public String editSceneDetailsPage() {
        return "shows/editSceneDetails";
    }
}