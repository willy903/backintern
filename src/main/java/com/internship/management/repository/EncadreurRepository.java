package com.internship.management.repository;

import com.internship.management.entity.Encadreur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EncadreurRepository extends JpaRepository<Encadreur, Long> {
    Optional<Encadreur> findByUserId(Long userId);
}
