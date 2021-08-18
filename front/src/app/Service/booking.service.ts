import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UploadFile} from 'ng-zorro-antd';
import Aula from '../Data/Aula';
import {FormControl} from '@angular/forms';
import {City} from '../Data/City';
import {Cinema} from '../Data/CinemasResponse';
import {AulasResponse} from '../Data/FilmsResponse';
import {Reserva} from "../Data/bookings-form";
import {Observable} from "rxjs";
import {Campus} from "../Data/Campus";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  baseUrl = 'http://localhost:8081/';

  constructor(private http: HttpClient) {
  }

   getCampusByCodEstudiante(codEstudiante: string) {
    return this.http.get<Campus>(this.baseUrl + 'campus?codEstudiante=' +codEstudiante);
  }

  getAulaByCodEstudiante(codEstudiante: string, idCampus: number) {
    return this.http.get<Aula>(this.baseUrl + 'campus?codEstudiante=' +codEstudiante +"?idCampus="+idCampus);
  }

  getCampuses() {
    return this.http.get(this.baseUrl + 'campuses');
  }

  getAulasByCampus(url: string) {
    console.log("Calling URL: "+url);
    return this.http.get(url);
  }

  getBookings(selectedCampus: any) {
    return this.http.get(selectedCampus._links.bookings.href);
  }

  getAsientosReserva(booking: any) {
    console.log("getAsientosReserva", booking)
    const url = booking._links.reservas.href;
    // const url = booking._links.projections.href.replace('{?booking}', '') + '?booking=FilmProjection';
    return this.http.get(url);
  }

  confirmarReserva(p: { codAlumno: string; idReserva: number }) {
    console.log("Calling reservarAsiento", p);
    return this.http.post(this.baseUrl + 'reservarAsiento', p);
  }


  fetchTickets(tickets: any) {
    return this.http.get(tickets);
  }

  addAula(fileList: UploadFile[], data: any) {
    const formData = new FormData();
    fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    formData.append('aulaData', new Blob([JSON.stringify(data)], {
      type: 'application/json'
    }));
    return this.http.post<Aula>(this.baseUrl + 'addAula', formData);
  }

  modifyAula(fileList: UploadFile[], aula: Aula, rawValue: Aula) {
    const formData = new FormData();

    formData.append('file', null);
    fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    rawValue.id = aula.id;
    rawValue.foto = aula.foto;
    formData.append('aulaData', new Blob([JSON.stringify(rawValue)], {
      type: 'application/json'
    }));
    console.log("Calling modifyAula.......");
    return this.http.post<Aula>(this.baseUrl + 'modifyAula', formData);
  }


  onlyNumbers = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (isNaN(control.value)) {
      return {chars: true, error: true};
    }
    return {};
  }

  getAulas(pageSize: number, pageIndex: number) {
    console.log("Getting Aulas");
    const requestUrl = this.baseUrl + `aulas?page=${pageIndex - 1}&size=${pageSize}`;
    console.log("Got Aulas" + requestUrl.length);
    return this.http.get(requestUrl);

  }
  getAula(id: number) {
    return this.http.get(this.baseUrl + 'aulas/' + id);
  }


  getMovie(id: number) {
    return this.http.get(this.baseUrl + 'clases/' + id);
  }

  getMovies() {
    return this.http.get<AulasResponse>(this.baseUrl + 'clases/');
  }

  getCity(id: number) {
    return this.http.get<City>(this.baseUrl + 'villes/' + id);
  }

  deleteMovie(id: number) {
    return this.http.delete(this.baseUrl + 'clases/' + id);
  }



  addCity(formData: any) {
    return this.http.post<City>(this.baseUrl + 'villes', formData);
  }

  deleteCity(id: any) {
    return this.http.delete(this.baseUrl + 'villes/' + id);
  }

  modifyCity(id: number, rawValue: any) {
    return this.http.patch<City>(this.baseUrl + 'villes/' + id, rawValue);
  }

  addCinema(rawValue: any) {
    return this.http.post<boolean>(this.baseUrl + 'addCinema', rawValue);
  }

  deleteCampus(id: any) {
    return this.http.delete(this.baseUrl + 'aulas/' + id);
  }

  getCinema(id: number) {
    return this.http.get<Cinema>(this.baseUrl + 'aulas/' + id);
  }

  addProjections(data: { claseId: number; aulaId: number; reservas: { date: any; price: any }[] }) {
    return this.http.post<boolean>(this.baseUrl + 'updateProjections', data);

  }

  deleteRoom(room: any) {
    if (room?.id) {
      return this.http.delete(this.baseUrl + 'aulas/' + room.id);
    }
  }
}
