import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { EsriMapComponent } from "./esri-map/esri-map.component";
import { AddAddressComponent } from './add-address/add-address.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [AppComponent, EsriMapComponent, AddAddressComponent],
  imports: [BrowserModule, BrowserAnimationsModule,MatToolbarModule,MatButtonModule,MatDialogModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
