
// ============================================
// showRestController.java
// ============================================
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

    @GetMapping("/getAll")
    public List<Map<String, Object>> getAllShows() {
        String sql = """
                        SELECT
                    s.showID as showID,
                    s.showName as showName,
                    s.yearSemester as yearSemester,
                    s.Director as director,
                    s.genre as genre,
                    s.playWright as playWright
                FROM shows s
                    """;
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/getShowIDName")
    public List<Map<String, Object>> getShowIDName(@RequestParam String searchBy, @RequestParam String searchValue) {
        try {
            String sql = "SELECT showName, yearSemester, showID FROM shows WHERE " + searchBy + " LIKE ?";
            return jdbcTemplate.queryForList(sql, new Object[] { "%" + searchValue + "%" });
        } catch (Exception e) {
            return List.of();
        }
    }

    @GetMapping("/getCrew")
    public List<Map<String, Object>> getShowCrew(@RequestParam String showID) {
        try {
            // FIXED: Removed multiple statements, removed INSERT, fixed string quotes
            String sql = """
                    SELECT s.showName, s.yearSemester, st.firstName, st.lastName, cs.roles, cs.crewID
                    FROM crew_in_show cs
                    JOIN shows s ON cs.showID = s.showID
                    JOIN student st ON st.netID = cs.crewID
                    WHERE s.showID = ?
                    """;
            return jdbcTemplate.queryForList(sql, showID);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }
}