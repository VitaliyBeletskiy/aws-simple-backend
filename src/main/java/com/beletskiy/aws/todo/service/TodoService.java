package com.beletskiy.aws.todo.service;

import com.beletskiy.aws.todo.dto.CreateTodoItemRequest;
import com.beletskiy.aws.todo.dto.TodoItemResponse;
import com.beletskiy.aws.todo.dto.UpdateTodoItemRequest;

import java.util.List;

public interface TodoService {

  TodoItemResponse create(CreateTodoItemRequest request);

  List<TodoItemResponse> findAll();

  TodoItemResponse findById(Long id);

  TodoItemResponse update(Long id, UpdateTodoItemRequest request);

  void delete(Long id);
}
