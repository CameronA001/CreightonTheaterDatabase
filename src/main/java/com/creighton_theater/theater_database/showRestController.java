package com.creighton_theater.theater_database;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
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

}