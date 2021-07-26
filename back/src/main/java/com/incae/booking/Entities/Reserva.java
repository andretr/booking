package com.incae.booking.Entities;

import com.incae.booking.enums.EstadoReserva;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity(name = "INCAE_BK_Reserva")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombreAlumno;
    private String codigoAlumno;

//    private double prix;
//    private Integer codAlumno;
    @Enumerated(EnumType.STRING)
    private EstadoReserva estadoReserva;
    private boolean preferencial;
    @ManyToOne
    private Asiento asiento;
    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Booking booking;
}
