import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { ComicComponent } from './comic/comic.component';
import { FooterComponent } from './footer/footer.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './/app-routing.module';
import { ComicFormComponent } from './comic-form/comic-form.component';

// Must be imported to use reactive forms
import { ReactiveFormsModule } from '@angular/forms';

// Required for communication over http
import { HttpClientModule } from '@angular/common/http';

// Import our comic service
import {ComicService} from './comic.service'

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ComicComponent,
    FooterComponent,
    AdminComponent,
    ComicFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ComicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
