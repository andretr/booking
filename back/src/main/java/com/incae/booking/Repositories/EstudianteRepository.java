package com.incae.booking.Repositories;

import com.incae.booking.Entities.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EstudianteRepository extends JpaRepository<Estudiante, String> {
}
