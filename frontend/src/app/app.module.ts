import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MaincontainerComponent } from './pages/maincontainer/maincontainer.component';
import { MetadataComponent } from './pages/metadata/metadata.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
//import { lbServices } from './services/lb-services';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { SearchbarComponent } from './pages/home/components/searchbar/searchbar.component';
import { UploadFilesComponent } from './pages/home/components/upload-files/upload-files.component';
import { MetadataItemComponent } from './pages/home/components/metadata-item/metadata-item.component';

// Providers to use LoopBack Services
import { ClientApi } from './services/lb-api/services/index';
import { DocumentApi } from './services/lb-api/services/index';
import { EnterpriseApi } from './services/lb-api/services/index';
import { MetadataApi } from './services/lb-api/services/index';
import { SDKModels } from './services/lb-api/services/index';
import { LoopBackAuth } from './services/lb-api/services/core/auth.service';
import { InternalStorage } from './services/lb-api/storage/storage.swaps'


import { HttpClientModule } from '@angular/common/http';
import { SocketConnection } from './services/lb-api/sockets/socket.connections';
import { SocketDriver } from './services/lb-api/sockets/socket.driver';

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
    MetadataItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ScrollingModule,
    ReactiveFormsModule
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
  bootstrap: [AppComponent]
})
export class AppModule { }
