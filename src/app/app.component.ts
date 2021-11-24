import { Component,OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { MouseEvent } from '@agm/core';
import { PostDataService } from './post-data.service';
// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
  draggable: boolean;
  content?:string;
  isShown:boolean;
  icon:string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  value: string;
  myLatlng: number;

  // Radius
  radius = 3000;
  radiusLat = 0;
  radiusLong = 0;
 
  markers: marker[] = []
 
  @ViewChild('search')
  public searchElementRef: ElementRef;

  // @ViewChild('hello')
  // public searchElementReff: ElementRef;

  public dirs: Array<any> = [
    {
      origin:'ccc',
      destination:'ddd',
      renderOptions: { polylineOptions:{ strokeColor:'#0f0'}},
    }];
  
  
    public dirss: Array<any> = [
      {
        origin:'ccc',
        destination:'ddd',
        renderOptions: { polylineOptions:{ strokeColor:'#f00'}},
      }];
  
      public direction: Array<any> = [
        {
          origin:'eee',
          destination:'fff',
          renderOptions: { polylineOptions:{ strokeColor:'#00f'}},
        }];  

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private post:PostDataService
  ) { }

  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      // this.hello();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          
 
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
 
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.radiusLat = this.latitude;
          this.radiusLong = this.longitude;
          this.zoom = 12;
          
        });
      });
    });
  }

  // hello() {
  //   //load Places Autocomplete
  //   this.mapsAPILoader.load().then(() => {
  //     this.setCurrentLocation();
  //     this.geoCoder = new google.maps.Geocoder;
 
  //     let autocomplete = new google.maps.places.Autocomplete(this.searchElementReff.nativeElement);
  //     autocomplete.addListener("place_changed", () => {
  //       this.ngZone.run(() => {
  //         //get the place result
  //         let place: google.maps.places.PlaceResult = autocomplete.getPlace();
 
  //         //verify result
  //         if (place.geometry === undefined || place.geometry === null) {
  //           return;
  //         }
 
  //         //set latitude, longitude and zoom
  //         this.latitude = place.geometry.location.lat();
  //         this.longitude = place.geometry.location.lng();
  //         this.radiusLat = this.latitude;
  //         this.radiusLong = this.longitude;
  //         this.zoom = 12;
  //       });
  //     });
  //   });
  // }

  
  // OnWrite(event: KeyboardEvent, $event:any){
  //   this.value=(<HTMLInputElement>event.target).value;
  //   this.radius = $event;
  //   console.log(this.value);
  // }
 
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude,this.longitude);

        for(let i=1;i<50;i++){
          this.markers.push(
            {
              lat: this.latitude+Math.random(),
              lng: this.longitude+Math.random(),
              label: `${i}`,
              draggable: false,
              content: `Content no ${i}`,
              isShown:false,
              icon:'./assets/marker-red.png'
            }
          );
        }
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
 
 
  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  radiusDragEnd($event: any) {
    console.log($event);
    this.radiusLat = $event.coords.lat;
    this.radiusLong = $event.coords.lng;
    this.showHideMarkers();
  }

  event(type,$event) {
    console.log(type,$event);
    this.radius = $event;
    this.showHideMarkers();
  }

  showHideMarkers(){
    Object.values(this.markers).forEach(value => {
      value.isShown = this.getDistanceBetween(value.lat,value.lng,this.radiusLat,this.radiusLong);
    });
  }

  getDistanceBetween(lat1,long1,lat2,long2){
    var from = new google.maps.LatLng(lat1,long1);
    var to = new google.maps.LatLng(lat2,long2);

    if(google.maps.geometry.spherical.computeDistanceBetween(from,to) <= this.radius){    
      console.log('Radius',this.radius);
      console.log('Distance Between',google.maps.geometry.spherical.computeDistanceBetween(
        from,to
      ));
      return true;
    }else{
      return false;
    }
  }
 
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
 
    });
  }


//   closeModal(sendData) { 
//     this.activeModal.close(sendData); 
//   }

//   saveLocation(){
//     const data = {
//       address: this.address,
//       latitude: this.latitude,
//       longitude: this.longitude
//     }
//     this.activeModal.close(data);
//   }
 }
 