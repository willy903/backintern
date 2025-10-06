package com.internship.management.repository;

import com.internship.management.entity.Intern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InternRepository extends JpaRepository<Intern, Long> {
    Optional<Intern> findByUserId(Long userId);
    List<Intern> findByEncadreurId(Long encadreurId);
    List<Intern> findByProjectId(Long projectId);
    List<Intern> findByStatus(Intern.InternshipStatus status);

}
