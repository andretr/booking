import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalService, UploadFile} from 'ng-zorro-antd';
import {BookingService} from '../../../Service/booking.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import Aula from '../../../Data/Aula';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-aula.component.html',
  styleUrls: ['./add-aula.component.css']
})
export class AddAulaComponent implements OnInit {
  aula: Aula;
  validateForm!: FormGroup;
  fileList: UploadFile[] = [];
  isLoading: boolean;
  routerSubscription: Subscription;
  modifyMode: boolean;

  constructor(private modal: NzModalService, private fb: FormBuilder,
              private bookingService: BookingService, private router: Router,
              private route: ActivatedRoute) {
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [file];
    return false;
  }


  ngOnInit(): void {
    this.validateForm = this.fb.group({
      nombre: [null, [Validators.required]],
      nroAsientos: [null, [Validators.required, this.bookingService.onlyNumbers, Validators.min(0)]],
      nroColumnas: [null, [Validators.required, this.bookingService.onlyNumbers, Validators.min(0)]],
      nroFilas: [null, [Validators.required, this.bookingService.onlyNumbers, Validators.min(0)]],
    });
    if (this.route.snapshot.url.toString().includes('modify')) {
      this.modifyMode = true;
      this.routerSubscription = this.route.params.subscribe((p: Params) => {
          this.bookingService.getAula(+p.id).subscribe((aula: Aula) => {
            this.isLoading = false;
            this.aula = aula;
            this.validateForm.get('nombre').setValue(aula.nombre);
            this.validateForm.get('nroAsientos').setValue(aula.nroAsientos);
            this.validateForm.get('nroFilas').setValue(aula.nroFilas);
            this.validateForm.get('nroColumnas').setValue(aula.nroColumnas);
          }, _ => {
            this.isLoading = false;
            this.aula = null;
          });
        }
      );
    }

  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.done();
    }
  }

  done(): void {
    if (this.fileList.length === 0 && !this.modifyMode) {
      this.modal.error({
        nzTitle: '<i>You didn\'t specify an image!</i>',
        nzOnOk: () => {
        }
      });
    } else {
      this.callApi();
    }

  }

  private callApi() {
    this.isLoading = true;
    let results: Observable<Aula>;
    if (this.modifyMode) {
      results = this.bookingService.modifyAula(this.fileList, this.aula, this.validateForm.getRawValue());
    } else {
      results = this.bookingService.addAula(this.fileList, this.validateForm.getRawValue());
    }
    results.subscribe((response: Aula) => {
      console.log('LLEGAMOS!!!!!!!!');
        this.isLoading = false;
        if (response?.id) {
          this.router.navigateByUrl('/aulas/details/' + response.id);
          console.log('DETAILS!!!!!!!!');
        } else {
          console.log('ERROR!!!!!!!!');
          this.modal.error({
            nzTitle: 'Error',
            nzContent: 'The returned aula id is null'
          });
        }
      }
      , error => {
        this.isLoading = false;
        this.modal.error({
          nzTitle: 'Error',
          nzContent: error.error.status + ', ' + error.error.error
        });
        console.log(error);
      });

  }
}
