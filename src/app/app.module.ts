import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AgmDirectionModule } from 'agm-direction'; 
import { HttpClientModule } from '@angular/common/http';
import { PostDataService } from './post-data.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCb8ixRPk3V4B_1wWMiAAeOYPUFQnvvZrI',
      libraries:['places']
    }),
    AgmDirectionModule,
    HttpClientModule,
    
  ],
  providers: [PostDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
