import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LogInComponent} from "./login/log-in.component";
import {HomeComponent} from "./home/home.component";
import {VehicleCatalogComponent} from "./vehicle-catalog/vehicle-catalog.component";
import {ReturnsComponent} from "./returns/returns.component";
import {ReservationsComponent} from "./reservations/reservations.component";
import {RentalsComponent} from "./rentals/rentals.component";
import {ClientRecordsComponent} from "./client-records/client-records.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LogInComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'catalog',
        pathMatch: 'full'
      },
      {
        path: 'catalog',
        component: VehicleCatalogComponent
      },
      {
        path: 'client-records',
        component: ClientRecordsComponent
      },
      {
        path: 'rentals',
        component: RentalsComponent
      },
      {
        path: 'reservations',
        component: ReservationsComponent
      }
      ,
      {
        path: 'returns',
        component: ReturnsComponent
      }
    ]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true}),
    BrowserAnimationsModule,
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule {
}
