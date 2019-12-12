import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';

import {FavoritesComponent} from './favorites.component';
import {CUSTOM_ELEMENTS_SCHEMA, InjectionToken, NO_ERRORS_SCHEMA} from "@angular/core";
import {AuditorApi, ClientApi, DocumentApi, MetadataApi, SDKModels} from "../../services/lb-api/services/custom";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {SocketConnection} from "../../services/lb-api/sockets/socket.connections";
import {SocketDriver} from "../../services/lb-api/sockets/socket.driver";
import {LoopBackAuth} from "../../services/lb-api/services/core";
import {InternalStorage} from "../../services/lb-api";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {Overlay} from "@angular/cdk/overlay";
import {CommonModule, DatePipe} from "@angular/common";
import {ScrollDispatchModule} from "@angular/cdk/scrolling";
import {By} from "@angular/platform-browser";
import {timeout} from "rxjs/operators";

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let docApi : DocumentApi;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ScrollDispatchModule,
        MatDialogModule
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
        DatePipe
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
    /*const docApi = fixture.debugElement.injector.get(DocumentApi);
    let data, dataFiltered;
    const filter = {
      where: {clientId: '5da5ecd69b976d2bcac8298c', isDeleted: false},
      include: 'metadatas',
    };*/
    console.log('QUIERO LLORAR');
    component.getUserItemList();
    console.log(component.dataFiltered);

  });

});
