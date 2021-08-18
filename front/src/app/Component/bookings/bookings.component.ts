import {Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren} from '@angular/core';
import {BookingService} from '../../Service/booking.service';
import {NzMessageService} from 'ng-zorro-antd';
import {NgModel} from "@angular/forms";

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {


  @ViewChildren('Button',{ read: ElementRef }) buttons: QueryList<any>;

  campusOptions: Array<{ id: number; nombre: string; aulas: string }> = [];
  codEstudiante='081357307';
  selectedCampus = null;
  isLoading = false;
  isLoadingReservas = false;
  aulas = null;
  selectedAula = null;
  listBookings = null;
  cardIndexes: number[];
  selectedReserva = null;
  asientoReserva: number;
  idBooking: number = 1;
  selectdAula = null;
  fullName: string;
  paymentNumber: string;
  isLoadingTickets: boolean;
  isAddCityModalVisible = false;
  isOkCityModalLoading = false;
  editMode: boolean;
  isAddCinemaModalVisible: boolean;
  editCinemaMode: boolean;
  editRoomMode: boolean;
  isEditRoomModalVisible: boolean;

  constructor(public bookingService: BookingService, private message: NzMessageService,private renderer: Renderer2) {
    console.log("Initializing Bookings");
  }

  errorFunc = (error) => {
    this.isLoading = false;
    this.isLoadingReservas = false;
    this.isLoadingTickets = false;
    console.log(error);
    this.message.error('Error');
  }

  resetData() {
    // this.isLoading = true;
    this.isLoadingReservas = false;
    this.aulas = null;
    this.selectedAula = null;
    this.listBookings = null;
    this.cardIndexes = [];
    this.selectedReserva = null;
    this.asientoReserva = null;
  }

  ngOnInit(): void {
    this.getCampuses();
    // this.getCampusByCodEstudiante();
  }

  onSelectCampus() {
    this.resetData();
    this.getAulasByCampus();
  }

  getReservas() {

    this.listBookings = null;
    this.bookingService.getBookings(this.selectedAula).subscribe(result => {
      this.isLoading = false;
      // @ts-ignore
      this.listBookings = result._embedded.bookings;
      this.cardIndexes = new Array(this.listBookings.length).fill(0);
      this.isLoadingReservas = this.listBookings.length !== 0;
      this.listBookings.forEach(booking => {
        this.bookingService.getAsientosReserva(booking).subscribe(asientosReserva => {
          // @ts-ignore
          booking.reservas = asientosReserva._embedded.reservas;
          console.log("RESERVAS: ", this.listBookings[0].reservas);
          booking.reservas.forEach(reserva => {
            // reserva.asiento.forEach(asiento => {
              reserva.preferencial = false;
            // });
          });
          this.isLoadingReservas = false;
        });
      }, this.errorFunc);
    }, this.errorFunc);
  }

  onSelectAula() {
    this.getReservas();
  }

  onSelectReserva(reserva: any, aula: any) {
    this.asientoReserva = null;
    this.selectedReserva = reserva;
    this.selectdAula = aula;

    this.getTickets();
  }

  showTickets(salle: any) {
    return this.selectdAula && this.selectdAula.id === salle.id && this.selectedReserva != null;
  }

  selectAsientoReserva(reserva: any) {
    console.log('OBJ reserva '+ JSON.stringify(reserva));
    reserva.selected = !reserva.selected;

    this.buttons.forEach(
      (el) => {
        if(!el.nativeElement.disabled){
          this.renderer.setStyle(el.nativeElement,'background-color', '#1890ff');
          this.renderer.setProperty(el.nativeElement, 'selected', 'false');

        }
      }
    );

     if (reserva.selected) {
      // this.asientoReserva.push(asiento.id);
      this.asientoReserva = reserva.id;
      console.log('Asiento reserva '+ this.asientoReserva);
    } else {
      // this.asientoReserva.splice(this.asientoReserva.indexOf(asiento.id), 1);
      this.asientoReserva = null;
    }
  }



  isSelectedItem(projection: any) {
    return this.selectedReserva && this.selectedReserva.id === projection.id;
  }

  getTickets() {
    this.selectedReserva.asiento = [];
    this.isLoadingTickets = true;
    this.bookingService.fetchTickets(this.selectedReserva._links.asiento.href).subscribe(result => {
      this.isLoadingTickets = false;
      // @ts-ignore
      this.selectedReserva.asiento = result._embedded.asiento;
    }, this.errorFunc);
  }

  confirmarReserva() {
    this.bookingService.confirmarReserva({
      codAlumno: this.codEstudiante,
      idReserva: this.asientoReserva
    })
      .subscribe((result: any[]) => {
          this.message.success('Ordered successfully !');
          this.getReservas();
        }, this.errorFunc
      );
  }

  getCampusByCodEstudiante(){
    console.log("Buscando campus");
    if (!this.isLoading) {
      this.selectedCampus = null;
      this.isLoading = true;
      this.bookingService.getCampusByCodEstudiante(this.codEstudiante).subscribe(result => {

        if(result){
          this.selectedCampus=result;
          console.log("CALLING getAulasByCampusByCodEstudiante!")
          this.getAulasByCampusByCodEstudiante();
        }
        // @ts-ignore
        // result._embedded.campuses.forEach(v => {
        //   this.selectedAula.
        // });
      }, this.errorFunc, () =>
        this.isLoading = false);
    }
  };

  getCampuses() {
    console.log("Buscando campuses");
    if (!this.isLoading) {
      this.selectedCampus = null;
      this.isLoading = true;
      this.bookingService.getCampuses().subscribe(result => {
        this.campusOptions = [];
        // @ts-ignore
        result._embedded.campuses.forEach(v => {
          console.log("Campuses Object: ", v);
          this.campusOptions.push({id: v.id, nombre: v.nombre, aulas: v._links.aulas});
        });
      }, this.errorFunc, () =>
        this.isLoading = false);
    }
  }

  getAulasByCampus(silence = false) {
    if (this.selectedCampus?.aulas?.href) {
      this.isLoading = true;
      this.bookingService.getAulasByCampus(this.selectedCampus.aulas.href).subscribe(result => {
        this.isLoading = false;
        // @ts-ignore
        this.aulas = result._embedded.aulas;
      }, this.errorFunc);
    } else {
      if (!silence) {
        this.message.error('No selecciono un campus');
      }
    }

  }

  getAulasByCampusByCodEstudiante(silence = false) {
    console.log("Buscando AULA!");
    if (this.selectedCampus?.aulas?.href) {
      this.isLoading = true;
      console.log("Buscando AULA2!")
      this.bookingService.getAulaByCodEstudiante(this.codEstudiante, this.selectedCampus.id).subscribe(result => {
        this.isLoading = false;
        if(result){
          this.selectedAula=result;
        }
      }, this.errorFunc);
    } else {
      if (!silence) {
        this.message.error('No selecciono un aula');
      }
    }

  }

  getAulas(silence = false) {
    console.log("Getting Aulas")
      this.isLoading = true;
      this.bookingService.getBookings(this.aulas.href).subscribe(result => {
        this.isLoading = false;
        // @ts-ignore
        this.aulas = result._embedded.aulas;
      }, this.errorFunc);


  }

  showAddCinemaModal(): void {
    this.isAddCinemaModalVisible = true;
  }

  showAddCityModal(): void {
    this.isAddCityModalVisible = true;
  }

  showAddSalleModal(salle: any): void {
    console.log(salle);
    this.selectdAula = salle;
    this.isEditRoomModalVisible = true;
  }

  handleAddCinemaModalOk(): void {
    this.isAddCinemaModalVisible = false;
    this.editCinemaMode = false;
    this.getAulas(true);
  }

  handleAddCinemaModalCancel(): void {
    this.isAddCinemaModalVisible = false;
    this.editCinemaMode = false;
    this.getAulas(true);
  }

  handleAddCityModalOk(): void {
    this.isAddCityModalVisible = false;
    this.editMode = false;
    this.getCampuses();
  }


  handleEditRoomModal(): void {
    this.isEditRoomModalVisible = false;
    this.editRoomMode = false;
    this.onSelectAula();
  }


  handleAddCityModalCancel(): void {
    this.isAddCityModalVisible = false;
    this.editMode = false;
    this.getCampuses();
  }

  editCampus() {
    this.editMode = true;
    this.isAddCityModalVisible = true;
  }

  editCinema() {
    this.editCinemaMode = true;
    this.isAddCinemaModalVisible = true;
  }

 

  isEditMode() {
    return this.editMode ? this.selectedCampus : null;
  }

  deleteCampus() {
    if (this.selectedAula) {
      this.bookingService.deleteCampus(this.selectedAula.id).subscribe(res => {
        this.selectedAula = null;
        this.message.success('Cinema deleted !');
        this.resetData();
        this.getAulas(true);
      }, error => this.errorFunc(error));
    }
  }

  isCinemaEditMode() {
    return this.editMode ? this.selectedAula : null;
  }

  deleteRoom(salle: any) {
    this.bookingService.deleteRoom(salle).subscribe(results => {
      this.message.success('Cinema deleted !');
      this.getReservas();
    }, error => this.errorFunc(error));
  }

  getSelectedRoom() {
    return this.isEditRoomModalVisible ? this.selectdAula : null;
  }
}
