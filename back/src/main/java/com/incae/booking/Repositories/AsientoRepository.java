package com.incae.booking.Repositories;

import com.incae.booking.Entities.Asiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RepositoryRestResource(path = "asientos")
@CrossOrigin("*")
public interface AsientoRepository extends JpaRepository<Asiento, Long> {
    List<Asiento> findByAulaId(Long id);
}
