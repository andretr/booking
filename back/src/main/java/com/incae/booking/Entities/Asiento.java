package com.incae.booking.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Collection;

@Entity(name = "INCAE_BK_Asiento")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int numero;

    @ManyToOne()
    private Aula aula;

    @OneToMany(mappedBy = "asiento")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Reserva> reservas;
}
