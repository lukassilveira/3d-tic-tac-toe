import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { HttpClient, HttpClientModule } from '@angular/common/http'

import { FormsModule } from '@angular/forms';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {
  transports: ['websocket']
} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
