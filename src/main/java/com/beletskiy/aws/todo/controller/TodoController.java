package com.beletskiy.aws.todo.controller;

import com.beletskiy.aws.todo.dto.CreateTodoItemRequest;
import com.beletskiy.aws.todo.dto.TodoItemResponse;
import com.beletskiy.aws.todo.dto.UpdateTodoItemRequest;
import com.beletskiy.aws.todo.service.TodoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/todos")
public class TodoController {

  private final TodoService todoService;

  public TodoController(TodoService todoService) {
    this.todoService = todoService;
  }

  @PostMapping
  public ResponseEntity<TodoItemResponse> create(@RequestBody CreateTodoItemRequest request) {
    TodoItemResponse created = todoService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @GetMapping
  public List<TodoItemResponse> getAll() {
    return todoService.findAll();
  }

  @GetMapping("/{id}")
  public TodoItemResponse getById(@PathVariable Long id) {
    return todoService.findById(id);
  }

  @PutMapping("/{id}")
  public TodoItemResponse update(
      @PathVariable Long id, @RequestBody UpdateTodoItemRequest request) {
    return todoService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    todoService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
