import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';



import {FavoritesComponent} from './favorites.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {AuditorApi, ClientApi, DocumentApi, MetadataApi, SDKModels} from '../../services/lb-api/services/custom';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {SocketConnection} from '../../services/lb-api/sockets/socket.connections';
import {SocketDriver} from '../../services/lb-api/sockets/socket.driver';
import {LoopBackAuth} from '../../services/lb-api/services/core';
import {InternalStorage} from '../../services/lb-api';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {CommonModule, DatePipe} from '@angular/common';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {BrowserModule, By} from '@angular/platform-browser';
import {MatMenuModule} from '@angular/material/menu';
import { ErrorHandler } from '../../services/lb-api/services/core/error.service';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let docApi: DocumentApi;
  let clientApi: ClientApi;
  let errorHandler: ErrorHandler;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ScrollDispatchModule,
        MatDialogModule,
        BrowserModule,
        MatMenuModule
      ],
      declarations: [
        FavoritesComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [
        ClientApi,
        HttpClient,
        HttpHandler,
        SocketConnection,
        SocketDriver,
        SDKModels,
        LoopBackAuth,
        InternalStorage,
        DocumentApi,
        MatDialog,
        Overlay,
        MetadataApi,
        AuditorApi,
        DatePipe,
        ErrorHandler
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only show favorites documents', () => {
    docApi = TestBed.get(DocumentApi);
    clientApi = TestBed.get(ClientApi);
    errorHandler = TestBed.get(ErrorHandler);

    const filter = {
      where: { clientId: '5da5ecd69b976d2bcac8298c', isDeleted: false, isFavourite: true},
      include: 'metadatas',
    };

    console.log({docApi});

    docApi.find(filter).subscribe((docList) =>
      (nect) => {
        docList.forEach((item) => {
          expect(item['isFavourite']).toEqual(true);
        });
      },
      (error) => { console.log('Error al buscar archivos: ', error); }
    );
  });
});
