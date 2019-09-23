import {RouterModule, Routes} from "@angular/router";
import {RootComponent} from "./root/root.component";
import {TestComponent} from "./test/test.component";
import {NgModule} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: 'test',
        component: TestComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule {
}
