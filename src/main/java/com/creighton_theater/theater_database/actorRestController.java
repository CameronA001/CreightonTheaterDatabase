package com.creighton_theater.theater_database;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Actor entity operations
 * Handles CRUD operations for actors (students with additional acting-related
 * information)
 * 
 * @author Cameron Abanes
 * @version 2.0
 */
@RestController
@RequestMapping("/actors")
public class actorRestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Retrieves all actors with their student information
     * Joins actor and student tables to get complete profile
     * 
     * @return List of all actors with measurements and student info
     */
    @GetMapping("/getAll")
    public ResponseEntity<List<Map<String, Object>>> getAllActors() {
        try {
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
                    ORDER BY s.lastname, s.firstname
                    """;

            List<Map<String, Object>> actors = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(actors);

        } catch (DataAccessException e) {
            System.err.println("Error fetching all actors: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Filters actors by column and value (supports netid, firstname, lastname,
     * shows)
     * Uses parameterized query to prevent SQL injection
     * 
     * @param column The column to filter by (netid, firstname, lastname, shows)
     * @param value  The value to search for
     * @return List of actors matching the search criteria
     */
    @GetMapping("/filterBy")
    public ResponseEntity<List<Map<String, Object>>> filterBy(
            @RequestParam String column,
            @RequestParam String value) {
        try {
            // Whitelist valid columns
            List<String> validColumns = List.of("netid", "firstname", "lastname", "shows");

            if (!validColumns.contains(column)) {
                return ResponseEntity.badRequest().body(null);
            }

            String sql;

            if ("shows".equals(column)) {
                // Filter by show ID - get actors who played characters in this show
                sql = """
                        SELECT DISTINCT
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
                        JOIN characters c ON a.netid = c.netid
                        WHERE c.showid LIKE ?
                        ORDER BY s.lastname, s.firstname
                        """;
            } else if ("firstname".equals(column) || "lastname".equals(column)) {
                // Filter by student name fields
                sql = String.format("""
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
                        WHERE s.%s LIKE ?
                        ORDER BY s.lastname, s.firstname
                        """, column);
            } else {
                // Filter by netid
                sql = """
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
                        WHERE a.netid LIKE ?
                        ORDER BY s.lastname, s.firstname
                        """;
            }

            List<Map<String, Object>> actors = jdbcTemplate.queryForList(sql, "%" + value + "%");
            return ResponseEntity.ok(actors);

        } catch (DataAccessException e) {
            System.err.println("Error filtering actors: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Adds a new actor profile for an existing student
     * All measurement fields are optional except netID
     */
    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addActor(
            @RequestParam String netID,
            @RequestParam(required = false) Integer yearsActingExperience,
            @RequestParam(required = false) String skinTone,
            @RequestParam(required = false) String piercings,
            @RequestParam(required = false) String hairColor,
            @RequestParam(required = false) String previousInjuries,
            @RequestParam(required = false) String specialNotes,
            @RequestParam(required = false) String height,
            @RequestParam(required = false) String ringSize,
            @RequestParam(required = false) String shoeSize,
            @RequestParam(required = false) String headCirc,
            @RequestParam(required = false) String neckBase,
            @RequestParam(required = false) String chest,
            @RequestParam(required = false) String waist,
            @RequestParam(required = false) String highHip,
            @RequestParam(required = false) String lowHip,
            @RequestParam(required = false) String armseyeToArmseyeFront,
            @RequestParam(required = false) String neckToWaistFront,
            @RequestParam(required = false) String armseyeToArmseyeBack,
            @RequestParam(required = false) String neckToWaistBack,
            @RequestParam(required = false) String centerBackToWrist,
            @RequestParam(required = false) String outsleeveToWrist,
            @RequestParam(required = false) String outseamBelowKnee,
            @RequestParam(required = false) String outseamToAnkle,
            @RequestParam(required = false) String outseamToFloor,
            @RequestParam(required = false) String otherNotes) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = """
                    INSERT INTO actor (
                        netid, yearsactingexperience, skintone, piercings, haircolor, previousinjuries,
                        specialnotes, height, ringsize, shoesize, headcirc,
                        neckbase, chest, waist, highhip, lowhip,
                        armseyetoarmseyefront, necktowaistfront, armseyetoarmseyeback,
                        necktowaistback, centerbacktowrist, outsleevetowrist,
                        outseambelowknee, outseamtoankle, outseamtofloor,
                        othernotes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """;

            jdbcTemplate.update(sql,
                    netID, yearsActingExperience, skinTone, piercings, hairColor, previousInjuries,
                    specialNotes, height, ringSize, shoeSize, headCirc,
                    neckBase, chest, waist, highHip, lowHip,
                    armseyeToArmseyeFront, neckToWaistFront, armseyeToArmseyeBack,
                    neckToWaistBack, centerBackToWrist, outsleeveToWrist,
                    outseamBelowKnee, outseamToAnkle, outseamToFloor,
                    otherNotes);

            response.put("status", "success");
            response.put("message", "Actor added successfully!");
            return ResponseEntity.ok(response);

        } catch (DataAccessException e) {
            System.err.println("Error adding actor: " + e.getMessage());
            response.put("status", "error");

            // Check for foreign key constraint (student doesn't exist)
            if (e.getMessage().contains("foreign key")) {
                response.put("message", "Cannot add actor: Student with netID '" + netID + "' does not exist");
            } else if (e.getMessage().contains("Duplicate entry") || e.getMessage().contains("duplicate key")) {
                response.put("message", "Actor profile already exists for this student");
            } else {
                response.put("message", "Error adding actor: " + e.getMessage());
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Edits an existing actor's information
     * netID cannot be changed (it's the primary key and foreign key to student)
     */
    @PostMapping("/edit")
    public ResponseEntity<Map<String, String>> editActor(
            @RequestParam("netID") String netID,
            @RequestParam(required = false) Integer yearsActingExperience,
            @RequestParam(required = false) String skinTone,
            @RequestParam(required = false) String piercings,
            @RequestParam(required = false) String hairColor,
            @RequestParam(required = false) String previousInjuries,
            @RequestParam(required = false) String specialNotes,
            @RequestParam(required = false) String height,
            @RequestParam(required = false) String ringSize,
            @RequestParam(required = false) String shoeSize,
            @RequestParam(required = false) String headCirc,
            @RequestParam(required = false) String neckBase,
            @RequestParam(required = false) String chest,
            @RequestParam(required = false) String waist,
            @RequestParam(required = false) String highHip,
            @RequestParam(required = false) String lowHip,
            @RequestParam(required = false) String armseyeToArmseyeFront,
            @RequestParam(required = false) String neckToWaistFront,
            @RequestParam(required = false) String armseyeToArmseyeBack,
            @RequestParam(required = false) String neckToWaistBack,
            @RequestParam(required = false) String centerBackToWrist,
            @RequestParam(required = false) String outsleeveToWrist,
            @RequestParam(required = false) String outseamBelowKnee,
            @RequestParam(required = false) String outseamToAnkle,
            @RequestParam(required = false) String outseamToFloor,
            @RequestParam(required = false) String otherNotes) {

        Map<String, String> response = new HashMap<>();

        try {
            String sql = """
                    UPDATE actor
                    SET yearsactingexperience = ?, skintone = ?, piercings = ?, haircolor = ?,
                        previousinjuries = ?, specialnotes = ?, height = ?, ringsize = ?, shoesize = ?,
                        headcirc = ?, neckbase = ?, chest = ?, waist = ?, highhip = ?, lowhip = ?,
                        armseyetoarmseyefront = ?, necktowaistfront = ?, armseyetoarmseyeback = ?,
                        necktowaistback = ?, centerbacktowrist = ?, outsleevetowrist = ?,
                        outseambelowknee = ?, outseamtoankle = ?, outseamtofloor = ?, othernotes = ?
                    WHERE netid = ?
                    """;

            int rowsAffected = jdbcTemplate.update(sql,
                    yearsActingExperience, skinTone, piercings, hairColor,
                    previousInjuries, specialNotes, height, ringSize, shoeSize,
                    headCirc, neckBase, chest, waist, highHip, lowHip,
                    armseyeToArmseyeFront, neckToWaistFront, armseyeToArmseyeBack,
                    neckToWaistBack, centerBackToWrist, outsleeveToWrist,
                    outseamBelowKnee, outseamToAnkle, outseamToFloor, otherNotes,
                    netID);

            if (rowsAffected > 0) {
                response.put("status", "success");
                response.put("message", "Actor updated successfully!");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Actor not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (DataAccessException e) {
            System.err.println("Error editing actor: " + e.getMessage());
            response.put("status", "error");
            response.put("message", "Error editing actor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}