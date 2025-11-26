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
        String sql = "SELECT * FROM actor";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/filterBy")
    public List<Map<String, Object>> filterBy(
            @RequestParam String value) {

        try {
            String sql = "SELECT * FROM actor WHERE netID LIKE ?";

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
    Double headCirc,
    Double neckBase,
    Double chest,
    Double waist,
    Double highHip,
    Double lowHip,
    Double armseyeToArmseyeFront,
    Double neckToWaistFront,
    Double armseyeToArmseyeBack,
    Double neckToWaistBack,
    Double centerBackToWrist,
    Double outsleeveToWrist,
    Double outseamBelowKnee,
    Double outseamToAnkle,
    Double outseamToFloor,
    String otherNotes
) {
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
            otherNotes
        );
        return ResponseEntity.ok("Actor added successfully");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Error adding actor: " + e.getMessage());
    }
}
}
