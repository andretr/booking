import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTableModule} from '@angular/material/table';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {NgZorroAntdModule, NzLayoutModule} from 'ng-zorro-antd';
import {TicketsComponent} from './Component/tickets/tickets.component';
import {BreadcrumbComponent} from './Component/breadcrumb/breadcrumb.component';
import {HomeComponent} from './Component/home/home.component';
import {AulasComponent} from './Component/aulas/aulas.component';
import {BookingsComponent} from './Component/bookings/bookings.component';
import {CarouselComponent} from './Component/home/carousel/carousel.component';
import {ShortDescriptionPipe} from './Service/short-description.pipe';
import {PathToUrlPipe} from './shared/path-to-url.pipe';
import {AddAulaComponent} from './Component/aulas/add-movie/add-aula.component';
import {AulaDetailsComponent} from './Component/aulas/aula-details/aula-details.component';
import {AddCampusComponent} from './Component/bookings/add-city/add-campus.component';
import {CampusFormComponent} from './Component/bookings/campus-form/campus-form.component';
import {EditRoomComponent} from './Component/bookings/edit-room/edit-room.component';


registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    TicketsComponent,
    BreadcrumbComponent,
    HomeComponent,
    AulasComponent,
    BookingsComponent,
    CarouselComponent,
    ShortDescriptionPipe,
    PathToUrlPipe,
    AddAulaComponent,
    AulaDetailsComponent,
    AddCampusComponent,
    CampusFormComponent,
    EditRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatTableModule
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
