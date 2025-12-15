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
                    ORDER BY s.lastName, s.firstName
                    """;

            List<Map<String, Object>> actors = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(actors);

        } catch (DataAccessException e) {
            System.err.println("Error fetching all actors: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Filters actors by column and value (supports netID, firstName, lastName,
     * shows)
     * Uses parameterized query to prevent SQL injection
     * 
     * @param column The column to filter by (netID, firstName, lastName, shows)
     * @param value  The value to search for
     * @return List of actors matching the search criteria
     */
    @GetMapping("/filterBy")
    public ResponseEntity<List<Map<String, Object>>> filterBy(
            @RequestParam String column,
            @RequestParam String value) {
        try {
            // Whitelist valid columns
            List<String> validColumns = List.of("netID", "firstName", "lastName", "shows");

            if (!validColumns.contains(column)) {
                return ResponseEntity.badRequest().body(null);
            }

            String sql;

            if ("shows".equals(column)) {
                // Filter by show ID - get actors who played characters in this show
                sql = """
                        SELECT DISTINCT
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
                        JOIN characters c ON a.netID = c.netID
                        WHERE c.showID LIKE ?
                        ORDER BY s.lastName, s.firstName
                        """;
            } else if ("firstName".equals(column) || "lastName".equals(column)) {
                // Filter by student name fields
                sql = String.format("""
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
                        WHERE s.%s LIKE ?
                        ORDER BY s.lastName, s.firstName
                        """, column);
            } else {
                // Filter by netID
                sql = """
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
                        WHERE a.netID LIKE ?
                        ORDER BY s.lastName, s.firstName
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
     * 
     * @param netID                 Student's netID (must exist in student table)
     * @param yearsActingExperience Number of years of acting experience
     * @param skinTone              Description of skin tone
     * @param piercings             Description of piercings
     * @param hairColor             Hair color
     * @param previousInjuries      Any previous injuries to note
     * @param specialNotes          Special notes for this actor
     * @param height                Height (string format, e.g., "5'8\"")
     * @param ringSize              Ring size
     * @param shoeSize              Shoe size
     * @param headCirc              Head circumference measurement
     * @param neckBase              Neck base measurement
     * @param chest                 Chest measurement
     * @param waist                 Waist measurement
     * @param highHip               High hip measurement
     * @param lowHip                Low hip measurement
     * @param armseyeToArmseyeFront Front armseye measurement
     * @param neckToWaistFront      Front neck to waist measurement
     * @param armseyeToArmseyeBack  Back armseye measurement
     * @param neckToWaistBack       Back neck to waist measurement
     * @param centerBackToWrist     Center back to wrist measurement
     * @param outsleeveToWrist      Outsleeve to wrist measurement
     * @param outseamBelowKnee      Outseam below knee measurement
     * @param outseamToAnkle        Outseam to ankle measurement
     * @param outseamToFloor        Outseam to floor measurement
     * @param otherNotes            Other notes
     * @return ResponseEntity with success or error message
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
                        netID, yearsActingExperience, skinTone, piercings, hairColor, previousInjuries,
                        specialNotes, height, ringSize, shoeSize, headCirc,
                        neckBase, chest, waist, highHip, lowHip,
                        armseyeToArmseyeFront, neckToWaistFront, armseyeToArmseyeBack,
                        neckToWaistBack, centerBackToWrist, outsleeveToWrist,
                        outseamBelowKnee, outseamToAnkle, outseamToFloor,
                        otherNotes
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
            } else if (e.getMessage().contains("Duplicate entry")) {
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
     * 
     * @param netID                 The actor's netID (from query parameter)
     * @param yearsActingExperience Updated years of experience
     * @param skinTone              Updated skin tone
     * @param piercings             Updated piercings description
     * @param hairColor             Updated hair color
     * @param previousInjuries      Updated previous injuries
     * @param specialNotes          Updated special notes
     * @param height                Updated height
     * @param ringSize              Updated ring size
     * @param shoeSize              Updated shoe size
     * @param headCirc              Updated head circumference
     * @param neckBase              Updated neck base
     * @param chest                 Updated chest measurement
     * @param waist                 Updated waist measurement
     * @param highHip               Updated high hip measurement
     * @param lowHip                Updated low hip measurement
     * @param armseyeToArmseyeFront Updated front armseye measurement
     * @param neckToWaistFront      Updated front neck to waist measurement
     * @param armseyeToArmseyeBack  Updated back armseye measurement
     * @param neckToWaistBack       Updated back neck to waist measurement
     * @param centerBackToWrist     Updated center back to wrist measurement
     * @param outsleeveToWrist      Updated outsleeve to wrist measurement
     * @param outseamBelowKnee      Updated outseam below knee measurement
     * @param outseamToAnkle        Updated outseam to ankle measurement
     * @param outseamToFloor        Updated outseam to floor measurement
     * @param otherNotes            Updated other notes
     * @return ResponseEntity with success or error message
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
                    SET yearsActingExperience = ?, skinTone = ?, piercings = ?, hairColor = ?,
                        previousInjuries = ?, specialNotes = ?, height = ?, ringSize = ?, shoeSize = ?,
                        headCirc = ?, neckBase = ?, chest = ?, waist = ?, highHip = ?, lowHip = ?,
                        armseyeToArmseyeFront = ?, neckToWaistFront = ?, armseyeToArmseyeBack = ?,
                        neckToWaistBack = ?, centerBackToWrist = ?, outsleeveToWrist = ?,
                        outseamBelowKnee = ?, outseamToAnkle = ?, outseamToFloor = ?, otherNotes = ?
                    WHERE netID = ?
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