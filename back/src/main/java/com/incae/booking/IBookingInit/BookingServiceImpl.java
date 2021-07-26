package com.incae.booking.IBookingInit;

import com.incae.booking.Entities.*;
import com.incae.booking.Repositories.*;
import com.incae.booking.enums.EstadoReserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Stream;

@Service
@Transactional
public class BookingServiceImpl implements IBookingService {
    @Autowired
    CampusRepository campusRepository;
    @Autowired
    AulaRepository aulaRepository;
    @Autowired
    AsientoRepository asientoRepository;
    @Autowired
    ClaseRepository claseRepository;
    @Autowired
    BookingRepository bookingRepository;
    @Autowired
    ReservaRepository reservaRepository;

    @Override
    public void initCampuses() {
        Stream.of("Walter Kissling Gam", "Francisco de Sola").forEach(name -> {
            Campus campus = new Campus();
            campus.setNombre(name);
            campus.setNroAulas(3);
            campusRepository.save(campus);
        });


    }

    @Override
    public void initAulas() {
        campusRepository.findAll().forEach(this::initAula);
    }

    @Override
    public void initAsientos() {
        aulaRepository.findAll().forEach(this::initAsiento);
    }

    private void initAsiento(Aula aula) {
        for (int i = 1; i <= aula.getNroAsientos(); i++) {
            Asiento asiento = new Asiento();
            asiento.setNumero(i);
            asiento.setAula(aula);
            asientoRepository.save(asiento);
        }
    }

    @Override
    public void initClases() {
        String[] titles = {"Global 2021", "Liderazgo Latinoamericano 1", "Liderazgo LAtinoamericano 2"};
        for (int i = 0; i < titles.length; i++) {
            Clase clase = new Clase();
            clase.setNombre(titles[i]);
            claseRepository.save(clase);
        }
    }

    @Override
    public void initBookings() {
        List<Clase> clases = claseRepository.findAll();

        campusRepository.findAll().forEach(campus -> {
            campus.getAulas().forEach(aula -> {
                initBooking(aula, clases);

            });
        });

    }

    @Override
    public void initReservas() {
        bookingRepository.findAll().forEach(this::initReserva);
    }

    @Override
    public void initReserva(Booking booking) {
        booking.getAula().getAsientos().forEach(asiento -> {
            Reserva reserva = new Reserva();
            reserva.setAsiento(asiento);
            reserva.setBooking(booking);
            reserva.setEstadoReserva(EstadoReserva.DISPONIBLE);
            reserva.setPreferencial(false);
            reservaRepository.save(reserva);
        });

    }

    @Override
    public void randomInitAulasCampus(Campus campus, Boolean init) {
        if (campus == null)
            campus = campusRepository.getOne((long) 1);
        initAula(campus);
        aulaRepository.findByCampus(campus).forEach(this::initAsiento);
        if (init != null) {
            List<Clase> clases = claseRepository.findAll();
            aulaRepository.findByCampus(campus).forEach(aula -> {
                List<Booking> bookings = this.initBooking(aula, clases);
                bookings.forEach(periodoReserva -> {
                    asientoRepository.findByAulaId(aula.getId()).forEach(asiento -> {
                        Reserva reserva = new Reserva();
                        reserva.setAsiento(asiento);
                        reserva.setBooking(periodoReserva);
                        reserva.setEstadoReserva(EstadoReserva.RESERVADO);
                        reservaRepository.save(reserva);
                    });
                });
            });
        }


    }

    private List<Booking> initBooking(Aula aula, List<Clase> clases) {
        List<Booking> bookings = new ArrayList();
            clases.forEach(clase -> {
                if(clase.getId().equals(aula.getId())) {
                    Booking booking = new Booking();
                    booking.setAula(aula);
                    booking.setClase(clase);
                    booking.setFechaInicio(new Date());
                    booking.setFechaFin(new Date());
                    booking.setFechaInicioReserva(new Date());
                    booking.setFechaFinReserva(new Date());
                    bookings.add(bookingRepository.save(booking));
                }
            });

        return bookings;
    }

    private void initAula(Campus campus) {

        if(campus.getId() <= 1){
        for (int i = 0; i < campus.getNroAulas(); i++) {
            Aula aula = new Aula();
            switch (i) {
                case 0:
                    aula.setNombre("Aula Huber Garnier");
                    break;
                case 1:
                    aula.setNombre("Aula Lorenzo Giordano");
                    break;
                case 2:
                    aula.setNombre("Aula Manuel Jimenez");
                    break;
            }

            aula.setNroAsientos(36);
            aula.setNroFilas(6);
            aula.setNroColumnas(6);
            aula.setCampus(campus);
            aulaRepository.save(aula);
        }
        }
    }
}
