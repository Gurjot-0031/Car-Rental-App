import {RouterModule, Routes} from "@angular/router";
import {TestComponent} from "./test/test.component";
import {NgModule} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LogInComponent} from "./login/log-in.component";
import {HomeComponent} from "./home/home.component";

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
        redirectTo: 'test',
        pathMatch: 'full'
      },
      {
        path: 'test',
        component: TestComponent
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
