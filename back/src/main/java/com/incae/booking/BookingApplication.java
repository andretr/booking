package com.incae.booking;

import com.incae.booking.Entities.Aula;
import com.incae.booking.Entities.Campus;
import com.incae.booking.Entities.Clase;
import com.incae.booking.Entities.Reserva;
import com.incae.booking.IBookingInit.IBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

@SpringBootApplication
public class BookingApplication implements CommandLineRunner {
    @Autowired
    IBookingService cinemaService;
    @Autowired
    RepositoryRestConfiguration repositoryRestConfiguration;

    public static void main(String[] args) {
        SpringApplication.run(BookingApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        repositoryRestConfiguration.exposeIdsFor(Campus.class, Clase.class, Reserva.class, Aula.class);
//        cinemaService.initCampuses();
//        cinemaService.initAulas();
//        cinemaService.initAsientos();
//        cinemaService.initClases();
//        cinemaService.initBookings();
//        cinemaService.initReservas();

    }
}
