package com.internship.management.repository;

import com.internship.management.entity.Encadreur;
import com.internship.management.entity.Intern;
import com.internship.management.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByEncadreurId(Long encadreurId);
    List<Project> findByDepartment(String department);
    List<Project> findByEncadreur(Encadreur encadreur);

    @Query("SELECT p FROM Project p JOIN p.interns i WHERE i.id = :internId")
    List<Project> findByInternsContaining(@Param("internId") Long internId);

    @Query("SELECT p FROM Project p JOIN p.interns i WHERE i.id = :internId")
    List<Project> findByInternId(@Param("internId") Long internId);

}
