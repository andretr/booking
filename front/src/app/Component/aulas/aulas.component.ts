import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import Aula from '../../Data/Aula';
import {BookingService} from '../../Service/booking.service';
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  aulas: Aula[];
  pageSize = 10;
  pageIndex = 1;
  totalElements = 10;
  isLoading = false;

  constructor(private router: Router, private bookingService: BookingService,
              private modal: NzModalService) {
  }

  ngOnInit(): void {
    this.getAulas();
  }

  getAulas(pageSizeChanged = false) {
    this.isLoading = true;
    this.bookingService.getAulas(this.pageSize, pageSizeChanged ? 1 : this.pageIndex).subscribe(data => {
      console.log("Data Aulas recibidas: " + data);
      // @ts-ignore
      this.aulas = data._embedded.aulas;
      // @ts-ignore
      this.totalElements = data.page.totalElements;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    });

  }

  goToAddAula() {
    this.router.navigateByUrl('aulas/add');
  }

  goToDetails(id: number) {
    if (id !== null) {
      this.router.navigateByUrl('aulas/details/' + id);
    }
  }

  deleteMovie(id: number) {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this aula?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.bookingService.deleteMovie(id).subscribe(response => {
        this.getAulas();
      }, error => {
        console.log(error);
      }),
      nzCancelText: 'No',
    });
  }

  editMovie(id: number) {
    if (id !== null) {
      this.router.navigateByUrl('aulas/modify/' + id);
    }
  }
}
