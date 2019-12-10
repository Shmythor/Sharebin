import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DocumentApi, ClientApi, MetadataApi } from '../../../services/lb-api/services/index';
import { HttpClient, HttpEvent, HttpParams, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { HideAndSeekService } from 'src/app/services/hide-and-seek.service';


@Component({
  selector: 'app-ventanaalert',
  templateUrl: './ventanaalert.component.html',
  styleUrls: ['./ventanaalert.component.css']
})
export class VentanaalertComponent implements OnInit {

  ngOnInit() {

  }
  constructor(public dialogRef: MatDialogRef<VentanaalertComponent>,public hideAndSeekService: HideAndSeekService,private clientapi: ClientApi, private docapi: DocumentApi, private metapi: MetadataApi
    , private http: HttpClient){

    }

    deleteAllElement(){
     this.docapi.destroyAll({isDeleted: true}).subscribe(() => {
       this.closeDialog();
       this.hideAndSeekService.showFileDeletedFileMessage();
       setTimeout(() => { this.hideAndSeekService.closeMessagefileDeletedFile(); }, 2500);
    });
    }

    closeDialog() {
      this.dialogRef.close(false);
    }

}
