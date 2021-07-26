import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AulasComponent} from './Component/aulas/aulas.component';
import {BookingsComponent} from './Component/bookings/bookings.component';
import {AulaDetailsComponent} from "./Component/aulas/aula-details/aula-details.component";
import {AddAulaComponent} from "./Component/aulas/add-movie/add-aula.component";
import {CampusFormComponent} from "./Component/bookings/campus-form/campus-form.component";
import {log} from "ng-zorro-antd";


const routes: Routes = [
 {
    path: '', redirectTo: 'bookings', pathMatch: 'full',
  },
  {
    path: 'aulas',
    children: [
      {path: '', component: AulasComponent},
      {path: 'add', component: AddAulaComponent},
      {path: 'details/:id', component: AulaDetailsComponent},
      {path: 'modify/:id', component: AddAulaComponent}
    ]
  },
  {
    path: 'bookings',
    children: [
      {path: '', component: BookingsComponent},
      {path: 'add', component: CampusFormComponent},
    ]
  }
  ,

  {
    path: 'campuses',
    children: [
      {path: '', component: BookingsComponent},
      {path: 'add', component: CampusFormComponent},
    ]
  }
  ,
  {
    path: '**', redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
