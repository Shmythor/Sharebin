import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { DocumentApi, ClientApi, MetadataApi } from '../../../services/lb-api/services/index';
import { HttpClient, HttpEvent, HttpParams, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BinComponent } from '../bin.component';
import { ModalComponent } from '../../../shared/_modal/modal.component';


@Component({
  selector: 'app-ventanaalert',
  templateUrl: './ventanaalert.component.html',
  styleUrls: ['./ventanaalert.component.css']
})
export class VentanaalertComponent implements OnInit {

  ngOnInit() {

  }
  constructor(private clientapi: ClientApi, private docapi: DocumentApi, private metapi: MetadataApi
    , private http: HttpClient){

    }

    deleteAllElement(){
     this.docapi.destroyAll([{isDeleted: false}]).subscribe(
       ()=>{ this.showConfirm()});
     
    }


    showConfirm(){
      document.getElementById('confirmDeleted').style.display = 'block';
    }




}
