package com.incae.booking.Controllers.REST;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.incae.booking.Entities.*;
import com.incae.booking.IBookingInit.IBookingService;
import com.incae.booking.Repositories.*;
import com.incae.booking.enums.EstadoReserva;
import lombok.Data;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.Date;

@RestController
@Transactional
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BookingRestController {
    final static String UPLOADED_FOLDER = System.getProperty("user.home") + "/Pictures/BookingApp/images/";

    @Autowired
    ClaseRepository claseRepository;
    @Autowired
    ReservaRepository reservaRepository;
    @Autowired
    CampusRepository campusRepository;
    @Autowired
    IBookingService cinemaService;
    @Autowired
    BookingRepository bookingRepository;
    @Autowired
    AulaRepository aulaRepository;
    @Autowired
    EstudianteRepository estudianteRepository;


    @GetMapping(path = "/campus")
    public ResponseEntity<?> getCampusByCodEstudiante(@RequestParam String codEstudiante) {
        if(codEstudiante != null) {
            Campus campus = campusRepository.findById(1L).orElse(null);;
            return new ResponseEntity(campus, HttpStatus.OK);
        } else throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR, "Error al cargar el campus"
        );
    }

    @GetMapping(path = "/aula")
    public ResponseEntity<?> getAulaByCodEstudiante(@RequestParam String codEstudiante, @RequestParam long campusId) {
        if(codEstudiante != null) {
            Aula aula = aulaRepository.findByCampusById(campusId).stream().findFirst().orElse(null);
            return new ResponseEntity(aula, HttpStatus.OK);
        } else throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, "Error al cargar el aula"
        );
    }


    @GetMapping(path = "/image/{id}", produces = {MediaType.IMAGE_JPEG_VALUE,MediaType.IMAGE_PNG_VALUE})
    public byte[] image(@PathVariable(name = "id") Long id) throws IOException {
        Aula aula = aulaRepository.getOne(id);
        File file = new File(UPLOADED_FOLDER + aula.getFoto());
        Path path = Paths.get(file.toURI());
        return Files.readAllBytes(path);
    }

    @GetMapping(path = "/image-by-name/{name:.+}", produces ={MediaType.IMAGE_JPEG_VALUE,MediaType.IMAGE_PNG_VALUE})
    public byte[] imageByPath(@PathVariable(name = "name") String name) {
        File file = new File(UPLOADED_FOLDER + name);
        Path path = Paths.get(file.toURI());
        try {
            return Files.readAllBytes(path);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No se encontro una imagen con ese nombre."
            );
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile uploadfile) {
        if (uploadfile.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Debe seleccionar una imagen."
            );
        }
        try {
            String slug = (new Date().getTime() / 1000) + uploadfile.getOriginalFilename();
            slug = slug.replace(" ", "_");
            byte[] bytes = uploadfile.getBytes();
            File dir = new File(UPLOADED_FOLDER);
            if (!dir.exists()) dir.mkdirs();
            Path path = Paths.get(UPLOADED_FOLDER + slug);
            Files.write(path, bytes);
            return new ResponseEntity(slug, new HttpHeaders(), HttpStatus.OK);

        } catch (IOException e) {
            System.out.println(e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Error al cargarla imagen"
            );
        }
    }


    @PostMapping(path = "reservarAsiento")
    public ResponseEntity<Reserva> reservarAsientos(@RequestBody ReservarAsientosForm reservarAsientosForm) {

            System.out.println("reservarAsiento= " + reservarAsientosForm);
            Reserva reserva = reservaRepository.findById(reservarAsientosForm.getIdReserva().longValue()).orElse(null);
            if(reserva == null){
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Id de reserva no encontrado");
            }
        Estudiante estudiante = estudianteRepository.findById(reservarAsientosForm.getCodAlumno()).orElse(null);
        if(estudiante == null){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Id de estudiante no encontrado");
        }

        reserva.setNombreAlumno(estudiante.getNombre().concat(" ").concat(estudiante.getApellido()));
        reserva.setEstadoReserva(EstadoReserva.RESERVADO);
        reserva.setCodigoAlumno(reservarAsientosForm.getCodAlumno());
        reservaRepository.save(reserva);
            return new ResponseEntity(reserva, HttpStatus.CREATED);
    }

    @PostMapping(path = "/addAula")
    public ResponseEntity<Clase> addAula(@RequestPart("aulaData") Aula aulaData,
                                         @RequestPart("file") MultipartFile file) {
        String path = this.uploadFile(file).getBody().toString();
        aulaData.setFoto(path);
        Aula aula = aulaRepository.save(aulaData);
        if (aula != null) {
            return new ResponseEntity(aula, HttpStatus.OK);
        } else throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, "Error al guardar el aula"
        );
    }


    @PostMapping(path = "/modifyAula")
    public ResponseEntity<Aula> modifyAula(@RequestPart("aulaData") Aula aulaData,
                                                @RequestPart(value = "file", required = false) MultipartFile file) {

        if (!aulaRepository.findById(aulaData.getId()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No se encontro el aula");
        }
        if (file != null) {
            aulaData.setFoto(this.uploadFile(file).getBody().toString());
        }
        return new ResponseEntity<>(aulaRepository.save(aulaData), HttpStatus.OK);

    }

    @PostMapping(path = "/agregarCampus")
    public ResponseEntity<Boolean> agregarCampus(@RequestBody CampusForm campusForm) {

        Campus campus = new Campus(null, campusForm.getName(), campusForm.getNbrRooms(),
                null);
        campus = campusRepository.save(campus);

        cinemaService.randomInitAulasCampus(campus, campusForm.getInit());
        return new ResponseEntity<>(true, HttpStatus.OK);

    }

    @PostMapping(path = "/actualizarBooking")
    public ResponseEntity<Boolean> actualizarBooking(@RequestBody BookingForm bookingForm) throws ParseException {
        Clase clase = claseRepository.findById(bookingForm.getClaseID()).orElse(null);
        Aula aula = aulaRepository.findById(bookingForm.getAulaID()).orElse(null);
        if (clase == null || aula == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Didn't found this " + (clase == null ? "Clase" : "Aula")
            );
        }
        bookingRepository.deleteAll(aulaRepository.getOne(aula.getId()).getBookings());

//        DateFormat dateFormat = new SimpleDateFormat("HH:mm");
        for (ReservaItem reservaItem : bookingForm.getReservaItems()) {
            Booking booking = new Booking();
            booking.setFechaInicio(new Date());
            booking.setFechaInicioReserva(new Date());
            booking.setFechaFinReserva(new Date());
            booking.setFechaFin(new Date());
            booking.setClase(clase);
            booking.setAula(aula);
            booking = bookingRepository.save(booking);
            cinemaService.initReserva(booking);
        }
        return new ResponseEntity<>(true, HttpStatus.OK);
    }
}

@Data
@ToString
class ReservarAsientosForm {
    private String codAlumno;
    private Integer idReserva;
}

@Data
@ToString
class CampusForm {
    private Boolean init;
    private String name;
//    private double longitude, latitude, altitude;
    private int nbrRooms;
//    private Long city;
}

@ToString
class BookingForm {
    private long claseID;
    private long aulaID;
    private ReservaItem[] reservaItems;

    @JsonProperty("claseId")
    public long getClaseID() {
        return claseID;
    }

    @JsonProperty("claseId")
    public void setClaseID(long value) {
        this.claseID = value;
    }

    @JsonProperty("aulaID")
    public long getAulaID() {
        return aulaID;
    }

    @JsonProperty("aulaID")
    public void setAulaID(long value) {
        this.aulaID = value;
    }

    @JsonProperty("reservas")
    public ReservaItem[] getReservaItems() {
        return reservaItems;
    }

    @JsonProperty("reservas")
    public void setReservaItems(ReservaItem[] value) {
        this.reservaItems = value;
    }
}

@ToString
class ReservaItem {
    private String fecha;
    private long codAlumno;

    @JsonProperty("fecha")
    public String getFecha() {
        return fecha;
    }

    @JsonProperty("fecha")
    public void setFecha(String value) {
        this.fecha = value;
    }

    @JsonProperty("codAlumno")
    public long getCodAlumno() {
        return codAlumno;
    }

    @JsonProperty("codAlumno")
    public void setCodAlumno(long value) {
        this.codAlumno = value;
    }
}
