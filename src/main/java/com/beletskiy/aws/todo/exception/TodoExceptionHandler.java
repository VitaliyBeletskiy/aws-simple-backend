package com.beletskiy.aws.todo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TodoExceptionHandler {

  @ExceptionHandler(TodoNotFoundException.class)
  public ResponseEntity<ApiErrorResponse> handleNotFound(TodoNotFoundException exception) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ApiErrorResponse(exception.getMessage()));
  }
}
