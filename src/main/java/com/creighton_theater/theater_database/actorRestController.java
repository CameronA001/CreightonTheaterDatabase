package com.creighton_theater.theater_database;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/actors")
public class actorRestController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/getAll")
    public List<Map<String, Object>> getAllActors() {
        System.out.println("penis");
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
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/filterBy")
    public List<Map<String, Object>> filterBy(
            @RequestParam String value) {

        try {
            String sql = "SELECT * FROM actor JOIN student ON actor.netID = student.netID WHERE actor.netID LIKE ?";

            return jdbcTemplate.queryForList(sql, new Object[] { "%" + value + "%" });
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addActor(
            String netID,
            Integer yearsActingExperience,
            String skinTone,
            String piercings,
            String hairColor,
            String previousInjuries,
            String specialNotes,
            String height,
            String ringSize,
            String shoeSize,
            String headCirc,
            String neckBase,
            String chest,
            String waist,
            String highHip,
            String lowHip,
            String armseyeToArmseyeFront,
            String neckToWaistFront,
            String armseyeToArmseyeBack,
            String neckToWaistBack,
            String centerBackToWrist,
            String outsleeveToWrist,
            String outseamBelowKnee,
            String outseamToAnkle,
            String outseamToFloor,
            String otherNotes) {
        String sql = """
                    INSERT INTO actor (
                        netID, yearsActingExperience, skinTone, piercings, hairColor, previousInjuries,
                        specialNotes, height, ringSize, shoeSize, headCirc,
                        neckBase, chest, waist, highHip, lowHip,
                        armseyeToArmseyeFront, neckToWaistFront, armseyeToArmseyeBack,
                        neckToWaistBack, centerBackToWrist, outsleeveToWrist,
                        outseamBelowKnee, outseamToAnkle, outseamToFloor,
                        otherNotes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """;

        try {
            jdbcTemplate.update(sql, netID, yearsActingExperience, skinTone, piercings, hairColor, previousInjuries,
                    specialNotes, height, ringSize, shoeSize, headCirc,
                    neckBase, chest, waist, highHip, lowHip,
                    armseyeToArmseyeFront, neckToWaistFront, armseyeToArmseyeBack,
                    neckToWaistBack, centerBackToWrist, outsleeveToWrist,
                    outseamBelowKnee, outseamToAnkle, outseamToFloor,
                    otherNotes);
            return ResponseEntity.ok("Actor added successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding actor: " + e.getMessage());
        }
    }

    @PostMapping("/edit")
    public String editActor(
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

        jdbcTemplate.update(sql,
                yearsActingExperience, skinTone, piercings, hairColor,
                previousInjuries, specialNotes, height, ringSize, shoeSize,
                headCirc, neckBase, chest, waist, highHip, lowHip,
                armseyeToArmseyeFront, neckToWaistFront, armseyeToArmseyeBack,
                neckToWaistBack, centerBackToWrist, outsleeveToWrist,
                outseamBelowKnee, outseamToAnkle, outseamToFloor, otherNotes,
                netID);

        return "OK";
    }

}
