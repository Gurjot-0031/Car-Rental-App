import {RouterModule, Routes} from "@angular/router";
import {TestComponent} from "./test/test.component";
import {NgModule} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/test',
    pathMatch: 'full'
  },
  {
    path: 'test',
    component: TestComponent
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
