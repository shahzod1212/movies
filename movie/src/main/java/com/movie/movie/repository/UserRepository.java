package com.movie.movie.repository;

import com.movie.movie.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    User findByEmailAndIdNotIgnoreCase(String email, Long id);

    List<User> findByEmailContaining(String email);
}
