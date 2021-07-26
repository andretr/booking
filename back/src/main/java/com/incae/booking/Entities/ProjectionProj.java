package com.incae.booking.Entities;

import org.springframework.data.rest.core.config.Projection;

import java.util.Collection;
import java.util.Date;

//@Projection(name = "FilmProjection", types = Booking.class)
public interface ProjectionProj {
    public Long getId();

    public double getPrix();

    public Date getDateProjection();

    public Aula getSalle();

    public Clase getFilm();

    public Collection<Reserva> getTickets();
}
