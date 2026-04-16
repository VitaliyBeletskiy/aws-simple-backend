package com.beletskiy.aws.todo.exception;

public class TodoNotFoundException extends RuntimeException {

  public TodoNotFoundException(Long id) {
    super("Todo item not found. id=" + id);
  }
}
