package com.incae.booking.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Collection;

@ToString
@Entity(name = "INCAE_BK_Campus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Campus implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
//    private double longitude, latitude, altitude;
    private int nroAulas;

    @OneToMany(mappedBy = "campus")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Aula> aulas;


}
