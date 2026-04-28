package com.beletskiy.aws.todo.repository;

import com.beletskiy.aws.todo.model.TodoItem;
import com.beletskiy.aws.todo.repository.entity.TodoItemEntity;
import com.beletskiy.aws.todo.repository.jpa.TodoSpringDataJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class JpaTodoRepositoryAdapter implements TodoRepository {

  private final TodoSpringDataJpaRepository jpaRepository;

  public JpaTodoRepositoryAdapter(TodoSpringDataJpaRepository jpaRepository) {
    this.jpaRepository = jpaRepository;
  }

  @Override
  public TodoItem create(String title, boolean done) {
    TodoItemEntity saved = jpaRepository.save(new TodoItemEntity(null, title, done));
    return toDomain(saved);
  }

  @Override
  public List<TodoItem> findAll() {
    return jpaRepository.findAll().stream().map(this::toDomain).toList();
  }

  @Override
  public Optional<TodoItem> findById(Long id) {
    return jpaRepository.findById(id).map(this::toDomain);
  }

  @Override
  public TodoItem update(TodoItem todoItem) {
    TodoItemEntity saved = jpaRepository.save(toEntity(todoItem));
    return toDomain(saved);
  }

  @Override
  public void deleteById(Long id) {
    jpaRepository.deleteById(id);
  }

  private TodoItem toDomain(TodoItemEntity entity) {
    return new TodoItem(entity.getId(), entity.getTitle(), entity.isDone());
  }

  private TodoItemEntity toEntity(TodoItem item) {
    return new TodoItemEntity(item.id(), item.title(), item.done());
  }
}


