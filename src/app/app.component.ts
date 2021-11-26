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
  selectRoad : string = ' ';
  selected = 'option2';
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
      renderOptions: { polylineOptions:{ strokeColor:'#0f0'}},
    }];
  
  
    public dirss: Array<any> = [
      {
        renderOptions: { polylineOptions:{ strokeColor:'#f00'}},
      }];
  
      public direction: Array<any> = [
        {
          renderOptions: { polylineOptions:{ strokeColor:'#00f'}},
        }];

        public one: any;
        public two: any;  
      
        public three: any;
        public four: any;
      
        public five:any;
        public six:any;
        public origin : any;
        public destination: any;
        public start: any;
        public end: any;

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

  highway_1(){
    this.one = { lat: 13.077831183855729, lng: 80.24454004001466};
    this.two = { lat: 13.097997996790372, lng:80.29346755575982}

  }

  highway_2(){
    this.three = { lat: 13.081853313635083, lng: 80.27624240946618 };
    this.four = { lat: 13.103962751591741, lng: 80.27348509859887 }
    
  }

  highway_3(){
    this.five = { lat: 13.103962751591741, lng: 80.27348509859887 };
    this.six = { lat:13.104404240892192 , lng:  80.28683177065697 };

  }

  beach(){
    this.origin = { lat: 13.085606284296366 , lng: 80.28925782871094  };
    this.destination = { lat: 13.058204235598163 , lng: 80.28221971225587 };
  }

  ritherdon(){
    this.start = { lat:13.07934651164317   , lng: 80.25873429012147 };
    this.end ={ lat: 13.107538400303502 , lng: 80.26059171986428};
  }

  
  selectChangeHandler(event:any){
    this.selectRoad = event.target.value;
    if(this.selectRoad == "Highway_1"){
      this.highway_1();
    }
    if(this.selectRoad == "Highway_2"){
      this.highway_2();
    }
    if(this.selectRoad == "Highway_3"){
      this.highway_3();
    }
    if(this.selectRoad == "Beach"){
      this.beach();
    }
    if(this.selectRoad == "Ritherdon"){
      this.ritherdon();
    }
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
 