package com.internship.management.repository;

import com.internship.management.entity.Encadreur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EncadreurRepository extends JpaRepository<Encadreur, Long> {
    Optional<Encadreur> findByUserId(Long userId);

    @Query("SELECT e FROM Encadreur e WHERE e.id = :id")
    Optional<Encadreur> findByIdWithQuery(@Param("id") Long id);
}
