package com.beletskiy.aws.todo.repository.jpa;

import com.beletskiy.aws.todo.repository.entity.TodoItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoSpringDataJpaRepository extends JpaRepository<TodoItemEntity, Long> {}

