package com.example.calculator;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class CalculatorController {

    // 1. KLASA WEWNĘTRZNA - musi być static, żeby Spring mógł ją "stworzyć" z JSONa
    public static class ComplexNumber {
        public double re;
        public double im;
    }

    @GetMapping("/power")
    public Map<String, Object> calculatePower(@RequestParam double voltage, @RequestParam double current) {
        double power = voltage * current;
        return Map.of("power", power, "unit", "W", "message", "Sukces!");
    }

    @PostMapping("/parallel-multi")
    public Map<String, Object> calculateParallelMulti(@RequestBody List<ComplexNumber> elements) {
        double totalYRe = 0;
        double totalYIm = 0;

        for (ComplexNumber z : elements) {
            double denominator = z.re * z.re + z.im * z.im;
            if (denominator != 0) {
                totalYRe += z.re / denominator;
                totalYIm += -z.im / denominator;
            }
        }

        double yMagSq = totalYRe * totalYRe + totalYIm * totalYIm;
        if (yMagSq == 0) return Map.of("re", 0, "im", 0, "error", "Błąd mianownika");

        return Map.of(
            "re", totalYRe / yMagSq,
            "im", -totalYIm / yMagSq,
            "message", "Obliczono dla " + elements.size() + " elementów równolegle"
        );
    }

    @PostMapping("/series")
    public Map<String, Object> calculateSeries(@RequestBody List<ComplexNumber> elements) {
        double resRe = 0;
        double resIm = 0;
        for (ComplexNumber z : elements) {
            resRe += z.re;
            resIm += z.im;
        }
        return Map.of("re", resRe, "im", resIm, "message", "Suma szeregowa OK");
    }
}