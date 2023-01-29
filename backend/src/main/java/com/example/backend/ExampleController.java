package com.example.backend;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/math")
public class ExampleController {

    @GetMapping("/examples")
    public List<String> getExamples(@RequestParam(value = "count", defaultValue = "5") Integer count) {
        List<String> list = new ArrayList<>();
        Random rand = new Random();
        for (int i = 0; i < count; i++) {
            int num1 = rand.nextInt(1000);
            int num2 = rand.nextInt(1000);
            int signNum = rand.nextInt(4);
            String sign = switch (signNum) {
                case 1 -> " - ";
                case 2 -> " * ";
                case 3 -> " / ";
                default -> " + ";
            };
            list.add(num1 + sign + num2);
        }
        return list;
    }
}
