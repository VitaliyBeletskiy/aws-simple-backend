package com.beletskiy.aws.todo.repository;

import com.beletskiy.aws.todo.model.TodoItem;

import java.util.List;
import java.util.Optional;

public interface TodoRepository {

  TodoItem create(String title, boolean done);

  List<TodoItem> findAll();

  Optional<TodoItem> findById(Long id);

  TodoItem update(TodoItem todoItem);

  void deleteById(Long id);
}
