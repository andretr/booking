package com.incae.booking.Repositories;

import com.incae.booking.Entities.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(path = "campuses")
@CrossOrigin("*")
public interface CampusRepository extends JpaRepository<Campus, Long> {
}
