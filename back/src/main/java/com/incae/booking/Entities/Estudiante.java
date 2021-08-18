package com.incae.booking.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jdk.nashorn.internal.ir.annotations.Immutable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Collection;

@Entity(name = "INCAE_BK_Estudiante")
@Immutable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Estudiante {

    @Id
    @Column(name = "PEOPLE_ID")
    private String id;

    @Column(name = "FIRST_NAME")
    private String nombre;

    @Column(name = "LAST_NAME")
    private String apellido;

    @Column(name = "BIRTH_COUNTRY")
    private String pais;

    @Column(name = "PrimaryEmailId")
    private Integer idEmail;

}
