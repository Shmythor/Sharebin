import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MaterialModule} from './material/material.module';
import {MatTabsModule} from '@angular/material';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';

import {MaincontainerComponent} from './pages/maincontainer/maincontainer.component';
import {MetadataComponent} from './pages/metadata/metadata.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {VentanaemergComponent} from './pages/home/components/ventanaemerg/ventanaemerg.component';
import {ModalModule} from '../app/shared/_modal';

import {ScrollingModule} from '@angular/cdk/scrolling';
import {UploadFilesComponent} from './pages/home/components/upload-files/upload-files.component';
// Providers to use LoopBack Services
import {ClientApi, DocumentApi, EnterpriseApi, MetadataApi, SDKModels, AuditorApi} from './services/lb-api/services/index';
import {LoopBackAuth} from './services/lb-api/services/core/auth.service';
import {InternalStorage} from './services/lb-api/storage/storage.swaps';


import {HttpClientModule} from '@angular/common/http';
import {SocketConnection} from './services/lb-api/sockets/socket.connections';
import {SocketDriver} from './services/lb-api/sockets/socket.driver';
import {ThemesComponent} from './pages/themes/themes.component';
import {BinComponent} from './pages/bin/bin.component';
import {VentanaalertComponent} from './pages/bin/ventanaalert/ventanaalert.component';
import {ShareURLPopupComponent} from './pages/home/components/share-urlpopup/share-urlpopup.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';

import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {SearchbarComponent} from './shared/components/searchbar/searchbar.component';
import { ThemeItemComponent } from './pages/themes/components/theme-item/theme-item.component';

import { DatePipe } from '@angular/common';
import { MatTabsModule, MatChipsModule, MatIconModule } from '@angular/material';



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
    BinComponent,
    VentanaalertComponent,
    ShareURLPopupComponent,
    MatConfirmDialogComponent,
    FavoritesComponent,
    ThemeItemComponent
  ],
  entryComponents: [VentanaemergComponent, VentanaalertComponent, MatConfirmDialogComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ScrollingModule,
    ReactiveFormsModule,
    MaterialModule,
    ModalModule,
    GridModule,
    NgbModule,
    NgxDropzoneModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule
  ],
  providers: [
    DatePipe,
    ClientApi,
    AuditorApi,
    SocketConnection,
    SocketDriver,
    DocumentApi,
    EnterpriseApi,
    MetadataApi,
    SDKModels,
    LoopBackAuth,
    InternalStorage,
    PageService,
    SortService,
    FilterService,
    GroupService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}



