package com.incae.booking.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;

@Entity(name = "INCAE_BK_Booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date fechaInicio;
    private Date fechaFin;
    private Date fechaInicioReserva;
    private Date fechaFinReserva;
    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Aula aula;
    @ManyToOne
    private Clase clase;
    @OneToMany(mappedBy = "booking")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Reserva> reservas;
}



