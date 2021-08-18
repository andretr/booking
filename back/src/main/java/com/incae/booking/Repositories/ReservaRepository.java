package com.incae.booking.Repositories;

import com.incae.booking.Entities.Aula;
import com.incae.booking.Entities.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Collection;

@RepositoryRestResource(path = "reservas")
@CrossOrigin("*")
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query(
            "FROM INCAE_BK_Reserva a " +
            "WHERE a.booking.id = :idBooking " +
            "AND a.id = :idReserva"
    )
    Reserva findByBookingAndReserva(Long idBooking, Long idReserva);
}
