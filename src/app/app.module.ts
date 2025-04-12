import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import {BookListComponent} from './pages/book-list/book-list.component';
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';





@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
   
    
  ]
})
export class AppModule { }
