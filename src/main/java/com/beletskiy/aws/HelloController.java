package com.beletskiy.aws;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
public class HelloController {

  @GetMapping("/")
  public Map<String, String> home() {
    ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Europe/Stockholm"));
    String formatted = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    return Map.of("message", "Backend is running", "timestamp", formatted);
  }
}
