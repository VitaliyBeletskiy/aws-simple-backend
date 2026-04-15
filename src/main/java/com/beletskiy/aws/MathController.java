package com.beletskiy.aws;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/math")
public class MathController {

  @GetMapping("/square")
  public Integer square(@RequestParam Integer a) {
    return a * a;
  }

  @GetMapping("/add")
  public Integer add(@RequestParam Integer a, @RequestParam Integer b) {
    return a + b;
  }
}
