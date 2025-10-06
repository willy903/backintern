package com.internship.management.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "encadreurs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Encadreur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String department;

    private String specialization;

    @OneToMany(mappedBy = "encadreur")
    private List<Intern> interns;

    @OneToMany(mappedBy = "encadreur")
    private List<Project> projects;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
