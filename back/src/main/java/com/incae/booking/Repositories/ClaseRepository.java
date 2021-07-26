package com.incae.booking.Repositories;

import com.incae.booking.Entities.Clase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(path = "clases")
@CrossOrigin("*")
public interface ClaseRepository extends JpaRepository<Clase, Long> {
}
