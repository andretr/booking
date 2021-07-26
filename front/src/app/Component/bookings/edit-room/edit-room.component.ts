import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {BookingService} from '../../../Service/booking.service';
import {BookingsForm} from '../../../Data/bookings-form';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styles: [
      `
      .dynamic-delete-button {
        cursor: pointer;
        position: relative;
        top: 4px;
        font-size: 24px;
        color: lightcoral;
        transition: all 0.3s;
      }

      .dynamic-delete-button:hover {
        color: red;
      }

      .passenger-input {
        margin-right: 8px;
      }

      [nz-form] {
        max-width: 600px;
      }

      .add-button {
        width: 60%;
      }
    `
  ]
})
export class EditRoomComponent implements OnInit, OnChanges {
  moviesOptions: Array<{ id: number; nombre: string }> = [];
  validateForm: FormGroup;
  isLoading: boolean;
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  @Input() room: any;
  @Input() opened: boolean;

  constructor(private fb: FormBuilder, private message: NzMessageService,
              private bookingService: BookingService) {
  }

  addField(e?: MouseEvent, initalData?: { date: string, price: number }): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `projection${id}`
    };
    const index = this.listOfControl.push(control);
    this.validateForm.addControl(this.listOfControl[index - 1].controlInstance,
      new FormGroup({
        date: new FormControl(initalData?.date, Validators.required),
        price: new FormControl(initalData?.price, Validators.required)
      }));
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  ngOnInit(): void {
    this.initData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    console.log(this.room, this.opened);
    if (this.opened) {
      this.getMovies();
      this.initData();
    } else {
      this.resetAll();
    }
  }

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm) {
      this.callApi();
    }
  }

  getMovies() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.bookingService.getMovies().subscribe(result => {
        this.isLoading = false;
        this.moviesOptions = [];
        // @ts-ignore
        result._embedded.aulas.forEach(v => {
          this.moviesOptions.push({id: v.id, nombre: v.nombre});
        });
      }, () => {
        this.isLoading = false;
      });
    }
  }

  resetAll() {
    this.moviesOptions = null;
    this.listOfControl = [];
    this.isLoading = false;
    this.room = null;
  }

  private callApi() {
    // @ts-ignore
    const data: BookingsForm = {};
    data.claseId = this.validateForm.get('aula').value;
    // @ts-ignore
    data.aulaId = this.room.id;
    data.reservas = [];
    const copy = this.validateForm.getRawValue();
    delete copy.aula;
    const pipe = new DatePipe('en-US');
    Object.keys(copy).forEach(key => {
      data.reservas.push({
        date: pipe.transform(copy[key].date, 'HH:mm:ss'),
        price: copy[key].price,
      });
    });
    console.log(data);
    this.isLoading = true;
    this.bookingService.addProjections( data).subscribe(() => {
        this.isLoading = false;
        this.message.create('success', `Updated successfully`);
      }
      , error => {
        this.isLoading = false;
        this.message.create('error', error.error.status + ', ' + error.error.error);
        console.log(error);
      });

  }

  private initData() {
    this.validateForm = this.fb.group({
      movie: [this.room?.reserva[0]?.film?.id, [Validators.required]],
    });
    if (this.room?.reserva) {
      this.room.reserva.forEach(projection => {
        this.addField(null, {date: projection.dateProjection, price: projection.prix});
      });
    } else {
      this.addField();
    }

  }
}
