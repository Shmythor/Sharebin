import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MaincontainerComponent } from './pages/maincontainer/maincontainer.component';
import { MetadataComponent } from './pages/metadata/metadata.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { VentanaemergComponent } from './pages/home/components/ventanaemerg/ventanaemerg.component';
import { ModalModule } from '../app/shared/_modal';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { SearchbarComponent } from './pages/home/components/searchbar/searchbar.component';
import { UploadFilesComponent } from './pages/home/components/upload-files/upload-files.component';

// Providers to use LoopBack Services
import { ClientApi } from './services/lb-api/services/index';
import { DocumentApi } from './services/lb-api/services/index';
import { EnterpriseApi } from './services/lb-api/services/index';
import { MetadataApi } from './services/lb-api/services/index';
import { SDKModels } from './services/lb-api/services/index';
import { LoopBackAuth } from './services/lb-api/services/core/auth.service';
import { InternalStorage } from './services/lb-api/storage/storage.swaps';



import { HttpClientModule } from '@angular/common/http';
import { SocketConnection } from './services/lb-api/sockets/socket.connections';
import { SocketDriver } from './services/lb-api/sockets/socket.driver';
import { ThemesComponent } from './pages/themes/themes.component';
import { BinComponent } from './pages/bin/bin.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    MaincontainerComponent,
    MetadataComponent,
    SearchbarComponent,
    UploadFilesComponent,
    VentanaemergComponent,
    UploadFilesComponent,
    ThemesComponent,
    BinComponent
  ],
  entryComponents: [ VentanaemergComponent ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ScrollingModule,
    ReactiveFormsModule,
    MaterialModule,
    ModalModule
  ],
  providers: [
    ClientApi,
    SocketConnection,
    SocketDriver,
    DocumentApi,
    EnterpriseApi,
    MetadataApi,
    SDKModels,
    LoopBackAuth,
    InternalStorage
   ],
  bootstrap: [AppComponent],
})
export class AppModule { }
