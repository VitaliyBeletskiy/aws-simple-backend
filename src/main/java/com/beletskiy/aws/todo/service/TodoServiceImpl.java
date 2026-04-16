package com.beletskiy.aws.todo.service;

import com.beletskiy.aws.todo.dto.CreateTodoItemRequest;
import com.beletskiy.aws.todo.dto.TodoItemResponse;
import com.beletskiy.aws.todo.dto.UpdateTodoItemRequest;
import com.beletskiy.aws.todo.exception.TodoNotFoundException;
import com.beletskiy.aws.todo.model.TodoItem;
import com.beletskiy.aws.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class TodoServiceImpl implements TodoService {

  private final TodoRepository todoRepository;

  public TodoServiceImpl(TodoRepository todoRepository) {
    this.todoRepository = todoRepository;
  }

  @Override
  public TodoItemResponse create(CreateTodoItemRequest request) {
    TodoItem todoItem = todoRepository.create(request.title(), Boolean.TRUE.equals(request.done()));
    return toResponse(todoItem);
  }

  @Override
  public List<TodoItemResponse> findAll() {
    return todoRepository.findAll().stream()
        .sorted(Comparator.comparing(TodoItem::id))
        .map(this::toResponse)
        .toList();
  }

  @Override
  public TodoItemResponse findById(Long id) {
    TodoItem todoItem =
        todoRepository.findById(id).orElseThrow(() -> new TodoNotFoundException(id));
    return toResponse(todoItem);
  }

  @Override
  public TodoItemResponse update(Long id, UpdateTodoItemRequest request) {
    TodoItem existing =
        todoRepository.findById(id).orElseThrow(() -> new TodoNotFoundException(id));

    TodoItem updated =
        new TodoItem(
            existing.id(),
            request.title() != null ? request.title() : existing.title(),
            request.done() != null ? request.done() : existing.done());

    return toResponse(todoRepository.update(updated));
  }

  @Override
  public void delete(Long id) {
    TodoItem existing =
        todoRepository.findById(id).orElseThrow(() -> new TodoNotFoundException(id));
    todoRepository.deleteById(existing.id());
  }

  private TodoItemResponse toResponse(TodoItem todoItem) {
    return new TodoItemResponse(todoItem.id(), todoItem.title(), todoItem.done());
  }
}
