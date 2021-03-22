/*
  Copyright 2019 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges
} from "@angular/core";
import { loadModules } from "esri-loader";
import esri = __esri; // Esri TypeScript Types

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})
export class EsriMapComponent implements OnInit, OnDestroy, OnChanges {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();
  //showCity: boolean = true

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  /**
   * _zoom sets map zoom
   * _center sets map center
   * _basemap sets type of map
   * _loaded provides map loaded status
   */
  private _zoom = 2;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap = "streets";
  private _loaded = false;
  private _view: esri.MapView = null;


  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input() showCity: boolean

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor() { }

  ngOnChanges(changes:any) {
    console.log(this.showCity)
    console.log(changes)
    console.log(this.showCity)
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(mapView => {

      // The map has been initialized
      console.log("mapView ready: ", this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
    });
  }

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [EsriMap, EsriMapView, FeatureLayer, esriRequest, Legend, BasemapToggle] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/request",
        "esri/widgets/Legend",
        "esri/widgets/BasemapToggle"
      ]);

      var labelSymbol0 = {
        type: "text",
        color: "black",
        font: {
          size: 8,
          weight: "bold"
        },
        haloSize: 1,
        haloColor: "white"
      };

      var labelSymbol1 = {
        type: "text",
        color: "red",
        font: {
          size: 12,
          weight: "bold"
        },
        haloSize: 1,
        haloColor: "white"
      };

      const labelClassCity = {
        labelExpressionInfo: { expression: "$feature.CITY_NAME" },
        labelPlacement: "center-right",
        symbol: labelSymbol0
      };

      var rendererCity = {
        type: "class-breaks",
        field: "pop",
        classBreakInfos: [
          {
            minValue: -1000,
            maxValue: 999999,
            symbol: {
              type: "simple-marker",
              color: "blue",
              size: 5,
              outline: {
                color: [128, 128, 128, 0.5],
                width: "0.5px"
              }
            },
            label: "Less than 1,000,000"
          },
          {
            minValue: 1000000,
            maxValue: 100000000,
            symbol: {
              type: "simple-marker",
              style: "triangle",
              size: 8,
              color: "red",
              outline: {
                color: [128, 128, 128, 0.5],
                width: "0.5px"
              }
            },
            label: "More than or equal 1,000,000"
          }
        ]
      };

      var uniqueCityRenderer = {
        type: "unique-value",
        field: "CITY_NAME",
        legendOptions: { title: "Name" },
        defaultSymbol: {
          type: "simple-marker",
          color: "black",
          size: 5,
          outline: {
            color: [128, 128, 128, 0.5],
            width: "0.5px"
          }
        },
        uniqueValueInfos: [{
          value: "City",
          symbol: {
            type: "simple-marker",
            style: "triangle",
            size: 12,
            color: "red",
            outline: {
              color: [128, 128, 128, 0.5],
              width: "0.5px"
            }
          }
        }],
      };

      var layerCities = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/world_cities/FeatureServer/0",
        popupTemplate: {
          title: "{CITY_NAME} city.",
          content:
            `<ul id="popup">
                        <li>CITY_NAME: {CITY_NAME}</li>
                        <li>ADMIN_NAME: {ADMIN_NAME}</li>
                        <li>CNTRY_NAME: {CNTRY_NAME}</li>
                        <li>STATUS: {STATUS}</li>
                        <li>POP: {POP}</li>
                        <li>POP_CLASS: {POP_CLASS}</li>
                    </ul>`
        },
        renderer: rendererCity
      });

      var layerCountries = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/World_borders/FeatureServer/0",
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [255, 128, 0, 0.2],
            outline: {
              width: 1,
              color: "red"
            }
          }
        },
        definitionExpression: "NAME = 'null'",
        visible: false
      });

      // Configure the Map
      console.log(this.showCity)
      let mapProperties: esri.MapProperties = {
        basemap: this._basemap,
        layers: [layerCountries]
      };
      if (this.showCity) {
        mapProperties.layers.push(layerCities)
      }



      const map: esri.Map = new EsriMap(mapProperties);

      //   map.basemap.load().then(function () {
      //     map.basemap.referenceLayers.items[0].visible = false;
      // });


      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      this._view = new EsriMapView(mapViewProperties);

      //Toggle
      // var basemapToggle = new BasemapToggle({
      //   view: this._view,
      //   nextBasemap: "topographic"
      // });

      // this._view.ui.add(basemapToggle, "bottom-left");

      // Legend Widget
      var legend = new Legend({
        view: this._view,
        layerInfos: [{
          layer: layerCities,
          title: "Cities"
        }]
      });

      this._view.ui.add(legend, "bottom-right");


      await this._view.when();
      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit() {
    console.log(this.showCity)
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(mapView => {

      // The map has been initialized
      console.log("mapView ready: ", this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
    });
  }


  ngOnDestroy() {
    if (this._view) {
      // destroy the map view
      this._view.container = null;
    }
  }
}
