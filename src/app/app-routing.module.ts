import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'users', 
    pathMatch: 'full'
  },
  { path: 'users', component: UserComponent },
  { path: 'users/create-user', component: CreateUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
