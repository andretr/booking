package com.incae.booking.Repositories;

import com.incae.booking.Entities.Aula;
import com.incae.booking.Entities.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Collection;

@RepositoryRestResource(path = "aulas")
@CrossOrigin("*")
public interface AulaRepository extends JpaRepository<Aula, Long> {
    Collection<Aula> findByCampus(Campus campus);

    @Query(
        "FROM INCAE_BK_Aula a " +
        "WHERE a.campus.id = :campusId"
    )
    Collection<Aula> findByCampusById(Long campusId);

}
