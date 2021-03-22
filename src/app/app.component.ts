import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  // Set our map properties
  mapCenter = [31, 31];
  basemapType = 'streets';
  mapZoomLevel = 3;
  showCity=false;

  onSelectCity(){
    this.showCity=!this.showCity;
    console.log(this.showCity)
    
  }

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }
}

