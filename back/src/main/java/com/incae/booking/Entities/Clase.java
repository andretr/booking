package com.incae.booking.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.Collection;

@Entity(name = "INCAE_BK_Clase")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Clase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
//    private String description;
//    private String realisateur;
//    private Date dateSortie;
//    private int dure;
//    private double rating;
//    private String photo;

    @OneToMany(mappedBy = "clase")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Booking> bookings;
}
