package com.beletskiy.aws.todo.repository;

import com.beletskiy.aws.todo.model.TodoItem;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class InMemoryTodoRepository implements TodoRepository {

  private final AtomicLong idSequence = new AtomicLong(0);
  private final ConcurrentMap<Long, TodoItem> storage = new ConcurrentHashMap<>();

  @Override
  public TodoItem create(String title, boolean done) {
    Long id = idSequence.incrementAndGet();
    TodoItem todoItem = new TodoItem(id, title, done);
    storage.put(id, todoItem);
    return todoItem;
  }

  @Override
  public List<TodoItem> findAll() {
    return new ArrayList<>(storage.values());
  }

  @Override
  public Optional<TodoItem> findById(Long id) {
    return Optional.ofNullable(storage.get(id));
  }

  @Override
  public TodoItem update(TodoItem todoItem) {
    storage.put(todoItem.id(), todoItem);
    return todoItem;
  }

  @Override
  public void deleteById(Long id) {
    storage.remove(id);
  }
}
