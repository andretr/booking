package com.incae.booking.Repositories;

import com.incae.booking.Entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(path = "bookings")
@CrossOrigin("*")
public interface BookingRepository extends JpaRepository<Booking, Long> {
//    Collection<Booking> findByAula(Aula aula);

//    List<Booking> findAllByAulaId(Long id);
}
