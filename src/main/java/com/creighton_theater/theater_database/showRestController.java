package com.creighton_theater.theater_database;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Show entity operations
 * Handles operations related to theater shows/productions
 * 
 * @author Cameron Abanes
 * @version 2.0
 */
@RestController
@RequestMapping("/shows")
public class showRestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Retrieves all shows from the database
     * 
     * @return List of all shows with their information
     */
    @GetMapping("/getAll")
    public ResponseEntity<List<Map<String, Object>>> getAllShows() {
        try {
            String sql = """
                    SELECT
                        s.showid as showid,
                        s.showname as showname,
                        s.yearsemester as yearsemester,
                        s.genre as genre,
                        s.director as director,
                        s.playwright as playwright
                    FROM shows s
                    ORDER BY s.yearsemester DESC, s.showname
                    """;

            List<Map<String, Object>> shows = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(shows);

        } catch (DataAccessException e) {
            System.err.println("Error fetching all shows: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Searches for shows by a specific field
     * Used for autocomplete functionality in forms
     * 
     * @param searchBy    The field to search by (showname, yearsemester, showid)
     * @param searchValue The value to search for (supports partial matches)
     * @return List of shows matching the search criteria
     */
    @GetMapping("/getShowIDName")
    public ResponseEntity<List<Map<String, Object>>> getShowIDName(
            @RequestParam String searchBy,
            @RequestParam String searchValue) {

        try {
            // Whitelist allowed search columns
            List<String> allowedColumns = List.of("showname", "yearsemester", "showid");

            if (!allowedColumns.contains(searchBy)) {
                return ResponseEntity.badRequest().body(null);
            }

            // Build SQL with validated column name
            String sql = String.format(
                    "SELECT showname, yearsemester, showid, genre, playwright FROM shows WHERE %s LIKE ? ORDER BY yearsemester DESC",
                    searchBy);

            List<Map<String, Object>> shows = jdbcTemplate.queryForList(sql, "%" + searchValue + "%");
            return ResponseEntity.ok(shows);

        } catch (DataAccessException e) {
            System.err.println("Error searching shows: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Retrieves crew members assigned to a specific show
     * 
     * @param showID The ID of the show
     * @return List of crew members with their roles in the show
     */
    @GetMapping("/getCrew")
    public ResponseEntity<List<Map<String, Object>>> getShowCrew(@RequestParam String showID) {
        try {
            String sql = """
                    SELECT
                        s.showname,
                        s.yearsemester,
                        st.firstname,
                        st.lastname,
                        cs.roles,
                        cs.crewid
                    FROM crew_in_show cs
                    JOIN shows s ON cs.showid = s.showid
                    JOIN student st ON st.netid = cs.crewid
                    WHERE s.showid = ?
                    ORDER BY st.lastname, st.firstname
                    """;

            List<Map<String, Object>> crewMembers = jdbcTemplate.queryForList(sql, showID);
            return ResponseEntity.ok(crewMembers);

        } catch (DataAccessException e) {
            System.err.println("Error fetching crew for show: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Loads scenes for a specific show
     * 
     * @param showID The show ID
     * @return List of scenes in the show
     */
    @GetMapping("/getScenesInShow")
    public ResponseEntity<List<Map<String, Object>>> getScenesInShow(@RequestParam String showID) {
        try {
            String sql = """
                    SELECT
                        s.showname,
                        s.yearsemester,
                        sc.scenename,
                        sc.act,
                        sc.locationset,
                        sc.song,
                        sc.bookscriptpages,
                        sc.crewinshow,
                        sc.showid
                    FROM scene sc
                    JOIN shows s ON sc.showid = s.showid
                    WHERE s.showid = ?
                    ORDER BY sc.act, sc.scenename
                    """;

            int showIdInt = Integer.parseInt(showID);
            List<Map<String, Object>> scenes = jdbcTemplate.queryForList(sql, new Object[] { showIdInt });

            return ResponseEntity.ok(scenes);

        } catch (DataAccessException e) {
            System.err.println("Error fetching scenes for show: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addShow(
            @RequestParam String showname,
            @RequestParam String yearsemester,
            @RequestParam String director,
            @RequestParam String genre,
            @RequestParam String playwright) {
        try {
            String sql = """
                    INSERT INTO shows (showname, yearsemester, director, genre, playwright)
                    VALUES (?, ?, ?, ?, ?)
                    """;

            int rowsAffected = jdbcTemplate.update(sql, showname, yearsemester, director, genre, playwright);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("Show added successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add show.");
            }

        } catch (DataAccessException e) {
            System.err.println("Error adding show: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding show.");
        }
    }

    /**
     * Deletes a show from the database
     * 
     * @param showID The ID of the show to delete
     * @return Response indicating success or failure of deletion
     */
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteShow(@RequestParam String showID) {
        try {
            int showIdInt = Integer.parseInt(showID);
            String sql = "DELETE FROM shows WHERE showid = ?";
            System.out.println("Attempting to delete showID = " + showID);

            int rowsAffected = jdbcTemplate.update(sql, showIdInt);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("Show deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Show not found.");
            }

        } catch (DataAccessException e) {
            System.err.println("Error deleting show: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting show.");
        }
    }

    /**
     * Retrieves characters in a specific show
     * 
     * @param showID
     * @return
     */
    @GetMapping("/getCharactersInShow")
    public ResponseEntity<List<Map<String, Object>>> getCharactersInShow(@RequestParam String showID) {
        try {
            String sql = """
                    SELECT
                        c.charactername,
                        st.firstname || ' ' || st.lastname AS actorName,
                        c.netid,
                        c.showid
                    FROM characters c
                    JOIN shows s on c.showid = s.showid
                    JOIN student st ON c.netid = st.netid
                    WHERE s.showid = ?
                    ORDER BY c.charactername
                    """;

            int showIdInt = Integer.parseInt(showID);
            List<Map<String, Object>> characters = jdbcTemplate.queryForList(sql, new Object[] { showIdInt });
            return ResponseEntity.ok(characters);

        } catch (DataAccessException e) {
            System.err.println("Error fetching characters for show: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Retrieves characters in a specific scene
     * 
     * @param sceneName The name of the scene
     * @return List of characters with their details in the scene
     */
    @GetMapping("/getSceneDetails")
    public ResponseEntity<List<Map<String, Object>>> getCharactersInScene(@RequestParam String sceneName) {
        try {
            String sql = """
                    SELECT
                        cs.charactername,
                        st.firstname || ' ' || st.lastname AS actorName,
                        cs.costumechange,
                        cs.costumeworn,
                        cs.characterlocation,
                        cs.changelocation,
                        cs.changelengthoftime AS changetime,
                        cs.additionalnotes AS notes,
                        cs.scenename,
                        cs.netid,
                        cs.showid
                    FROM character_in_scene cs
                    JOIN shows s on cs.showid = s.showid
                    JOIN student st ON cs.netid = st.netid
                    WHERE cs.scenename LIKE CONCAT('%', ?, '%')
                    ORDER BY cs.charactername
                    """;

            List<Map<String, Object>> characters = jdbcTemplate.queryForList(sql, new Object[] { sceneName });
            return ResponseEntity.ok(characters);

        } catch (DataAccessException e) {
            System.err.println("Error fetching characters for scene: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Adds a new scene to a show
     * 
     * @param scenename       The name of the scene
     * @param act             The act number
     * @param locationset     The location/set
     * @param song            Song in the scene (optional)
     * @param bookscriptpages Book/script pages
     * @param crewinshow      Crew needed in scene
     * @param showID          The show ID
     * @return Response indicating success or failure
     */
    @PostMapping("/addScene")
    public ResponseEntity<Map<String, String>> addScene(
            @RequestParam String scenename,
            @RequestParam String act,
            @RequestParam String locationset,
            @RequestParam(required = false) String song,
            @RequestParam(required = false) String bookscriptpages,
            @RequestParam(required = false) String crewinshow,
            @RequestParam String showID) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = """
                    INSERT INTO scene (scenename, act, locationset, song, bookscriptpages, crewinshow, showid)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """;

            int showIdInt = Integer.parseInt(showID);
            int actInt = Integer.parseInt(act);
            jdbcTemplate.update(sql, scenename, actInt, locationset, song, bookscriptpages, crewinshow, showIdInt);

            response.put("status", "success");
            response.put("message", "Scene added successfully!");
            return ResponseEntity.ok(response);

        } catch (DataIntegrityViolationException e) {
            String message = e.getRootCause() != null ? e.getRootCause().getMessage() : e.getMessage();

            response.put("status", "error");

            if (message != null && message.toLowerCase().contains("foreign key")) {
                response.put("message", "Cannot add scene: referenced showID does not exist.");
            } else if (message != null && message.toLowerCase().contains("duplicate")) {
                response.put("message", "This scene already exists for this show");
            } else {
                response.put("message", message);
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (DataAccessException e) {
            System.err.println("Error adding scene: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error adding scene: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Edits a scene's information
     * 
     * @param scenename       The current scene name
     * @param newScenename    The new scene name
     * @param act             The act number
     * @param locationset     The location/set
     * @param song            Song in the scene
     * @param bookscriptpages Book/script pages
     * @param crewinshow      Crew needed in scene
     * @param showID          The show ID
     * @return Response indicating success or failure
     */
    @PostMapping("/editScene")
    public ResponseEntity<Map<String, String>> editScene(
            @RequestParam String scenename,
            @RequestParam String newScenename,
            @RequestParam String act,
            @RequestParam String locationset,
            @RequestParam(required = false) String song,
            @RequestParam(required = false) String bookscriptpages,
            @RequestParam(required = false) String crewinshow,
            @RequestParam String showID) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = """
                    UPDATE scene
                    SET scenename = ?, "act" = ?, locationset = ?, song = ?, bookscriptpages = ?, crewinshow = ?
                    WHERE scenename = ? AND showid = ?
                    """;

            int showIdInt = Integer.parseInt(showID);
            int actInt = Integer.parseInt(act);

            System.out.println("Updating scene:");
            System.out.println("Original sceneName: '" + scenename + "'");
            System.out.println("showID: " + showIdInt);

            int rowsAffected = jdbcTemplate.update(sql, newScenename, actInt, locationset, song, bookscriptpages,
                    crewinshow, scenename, showIdInt);

            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Scene updated successfully!");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Scene not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (DataAccessException e) {
            System.err.println("Error editing scene: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error editing scene: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Adds a character to a scene with costume/location details
     * 
     * @param scenename         The scene name
     * @param charactername     The character name
     * @param netid             The actor's netID
     * @param showID            The show ID
     * @param costumechange     Whether there's a costume change
     * @param costumeworn       Description of costume worn
     * @param characterlocation Character's location in scene
     * @param changelocation    Location of costume change
     * @param changetime        Time for costume change
     * @param notes             Additional notes
     * @return Response indicating success or failure
     */
    @PostMapping("/addSceneDetails")
    public ResponseEntity<Map<String, String>> addSceneDetails(
            @RequestParam String scenename,
            @RequestParam String charactername,
            @RequestParam String netid,
            @RequestParam String showID,
            @RequestParam(required = false) String costumechange,
            @RequestParam(required = false) String costumeworn,
            @RequestParam(required = false) String characterlocation,
            @RequestParam(required = false) String changelocation,
            @RequestParam(required = false) String changetime,
            @RequestParam(required = false) String notes) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = """
                    INSERT INTO character_in_scene
                    (scenename, charactername, netid, showid, costumechange, costumeworn,
                     characterlocation, changelocation, changelengthoftime, additionalnotes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """;

            int showIdInt = Integer.parseInt(showID);
            jdbcTemplate.update(sql, scenename, charactername, netid, showIdInt, costumechange, costumeworn,
                    characterlocation, changelocation, changetime, notes);

            response.put("status", "success");
            response.put("message", "Scene details added successfully!");
            return ResponseEntity.ok(response);

        } catch (DataIntegrityViolationException e) {
            String message = e.getRootCause() != null ? e.getRootCause().getMessage() : e.getMessage();

            response.put("status", "error");

            if (message != null && message.toLowerCase().contains("foreign key")) {
                response.put("message",
                        "Cannot add scene details: referenced scene, character, or show does not exist.");
            } else if (message != null && message.toLowerCase().contains("duplicate")) {
                response.put("message", "This character is already in this scene");
            } else {
                response.put("message", message);
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (DataAccessException e) {
            System.err.println("Error adding scene details: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error adding scene details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Edits scene details for a character in a scene
     * 
     * @param scenename         The scene name
     * @param charactername     The character name
     * @param netid             The actor's netID
     * @param showID            The show ID
     * @param costumechange     Whether there's a costume change
     * @param costumeworn       Description of costume worn
     * @param characterlocation Character's location in scene
     * @param changelocation    Location of costume change
     * @param changetime        Time for costume change
     * @param notes             Additional notes
     * @return Response indicating success or failure
     */
    @PostMapping("/editSceneDetails")
    public ResponseEntity<Map<String, String>> editSceneDetails(
            @RequestParam String scenename,
            @RequestParam String charactername,
            @RequestParam String netid,
            @RequestParam String showID,
            @RequestParam(required = false) String costumechange,
            @RequestParam(required = false) String costumeworn,
            @RequestParam(required = false) String characterlocation,
            @RequestParam(required = false) String changelocation,
            @RequestParam(required = false) String changetime,
            @RequestParam(required = false) String notes) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = """
                    UPDATE character_in_scene
                    SET costumechange = ?, costumeworn = ?, characterlocation = ?,
                        changelocation = ?, changelengthoftime = ?, additionalnotes = ?
                    WHERE scenename = ? AND charactername = ? AND netid = ? AND showid = ?
                    """;

            int showIdInt = Integer.parseInt(showID);
            int rowsAffected = jdbcTemplate.update(sql, costumechange, costumeworn, characterlocation, changelocation,
                    changetime, notes, scenename, charactername, netid, showIdInt);

            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Scene details updated successfully!");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Scene details not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (DataAccessException e) {
            System.err.println("Error editing scene details: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error editing scene details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Deletes a scene from the database
     * 
     * @param sceneName The name of the scene to delete
     * @param showID    The show ID
     * @return Response indicating success or failure
     */
    @DeleteMapping("/deleteScene")
    public ResponseEntity<String> deleteScene(
            @RequestParam String sceneName,
            @RequestParam String showID) {
        try {
            int showIdInt = Integer.parseInt(showID);
            String sql = "DELETE FROM scene WHERE scenename = ? AND showid = ?";

            int rowsAffected = jdbcTemplate.update(sql, sceneName, showIdInt);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("Scene deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Scene not found.");
            }

        } catch (DataAccessException e) {
            System.err.println("Error deleting scene: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting scene.");
        }
    }

    @DeleteMapping("/deleteSceneDetails")
    public ResponseEntity<String> deleteSceneDetails(
            @RequestParam String scenename,
            @RequestParam String charactername,
            @RequestParam String netid,
            @RequestParam String showID) {
        try {
            int showIdInt = Integer.parseInt(showID);
            String sql = "DELETE FROM character_in_scene WHERE scenename = ? AND charactername = ? AND netid = ? AND showid = ?";

            int rowsAffected = jdbcTemplate.update(sql, scenename, charactername, netid, showIdInt);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("Scene details deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Scene details not found.");
            }

        } catch (DataAccessException e) {
            System.err.println("Error deleting scene details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting scene details.");
        }
    }
}