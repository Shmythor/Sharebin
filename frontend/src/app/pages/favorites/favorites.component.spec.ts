import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FavoritesComponent} from './favorites.component';
import {CUSTOM_ELEMENTS_SCHEMA, InjectionToken} from "@angular/core";
import {ClientApi, DocumentApi, SDKModels} from "../../services/lb-api/services/custom";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {SocketConnection} from "../../services/lb-api/sockets/socket.connections";
import {SocketDriver} from "../../services/lb-api/sockets/socket.driver";
import {LoopBackAuth} from "../../services/lb-api/services/core";
import {InternalStorage} from "../../services/lb-api";
import {MatDialog} from "@angular/material/dialog";
import {Overlay} from "@angular/cdk/overlay";

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FavoritesComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        Overlay
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only be favorites documents', () => {
    //const count = component.dataFiltered.filter(doc => doc.isFavourite);
    expect(component).toBeUndefined();
  });
});
