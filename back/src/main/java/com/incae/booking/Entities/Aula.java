package com.incae.booking.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Collection;

@Entity(name = "INCAE_BK_Aula")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private int nroAsientos;
    private int nroFilas;
    private int nroColumnas;
    private String foto;

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Campus campus;
    @OneToMany(mappedBy = "aula")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Asiento> asientos;
    @OneToMany(mappedBy = "aula")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Booking> bookings;

}
