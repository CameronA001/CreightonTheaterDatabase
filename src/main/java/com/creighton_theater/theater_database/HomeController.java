package com.creighton_theater.theater_database;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/student/loadpage")
    public String studentPage() {
        return "students";
    }
        @GetMapping("/")
    public String landingPage() {
        return "index";
    }

}
