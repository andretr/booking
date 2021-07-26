import {Component, OnDestroy, OnInit} from '@angular/core';
import Aula from '../../../Data/Aula';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BookingService} from '../../../Service/booking.service';
import {Subscription} from 'rxjs';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';


@Component({
  selector: 'app-aula-details',
  templateUrl: './aula-details.component.html',
  styleUrls: ['./aula-details.component.css']
})
// tslint:disable-next-line:component-class-suffix


export class AulaDetailsComponent implements OnInit, OnDestroy {
  isLoading = true;
  aula: Aula;
  routerSubscription: Subscription;

  constructor(private router: Router, private bookingService: BookingService,
              private route: ActivatedRoute, private modal: NzModalService,
              private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.routerSubscription = this.route.params.subscribe((p: Params) => {
        this.bookingService.getAula(+p.id).subscribe((aula: Aula) => {
          this.isLoading = false;
          this.aula = aula;
        }, _ => {
          this.isLoading = false;
          this.aula = null;
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  navigateToMovies() {
    this.router.navigateByUrl('/aulas');
  }

  modifyMovie() {
    this.router.navigateByUrl('/aulas/modify/' + this.aula.id);
  }

  deleteMovie() {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this aula?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.bookingService.deleteMovie(this.aula.id).subscribe(_ => {
        this.message.create('success', `Movies deleted successfully`, {nzPauseOnHover: true});
        this.aula = null;
      }, error => {
        console.log(error);
      }),
      nzCancelText: 'No',
    });
  }


}
