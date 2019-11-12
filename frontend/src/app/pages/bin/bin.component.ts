import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DocumentApi, ClientApi, MetadataApi } from '../../services/lb-api/services/index';
import { VentanaalertComponent } from 'src/app/pages/bin/ventanaalert/ventanaalert.component';
import { HttpClient, HttpEvent, HttpParams, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { saveAs } from '../../../../node_modules/file-saver/src/FileSaver.js';
import { VentanaemergComponent } from '../home/components/ventanaemerg/ventanaemerg.component';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})
export class BinComponent implements OnInit {
   @ViewChild('textarea', {static: false}) textarea: ElementRef;
  @ViewChild('nameInput', {static: false}) nameInput: ElementRef;
filters = [true, false, false];


  data: any;
  dataFiltered: any;
  itemSelected: any;
  textAreaText: string;
  metadata: any;
  tempMetadata: any;
  searchValue: string;
  hoverIndex: number;


 constructor(private clientapi: ClientApi, private docapi: DocumentApi, private metapi: MetadataApi,
             public dialog: MatDialog, private http: HttpClient) {
    this.data = [];
    this.dataFiltered = [];
    this.metadata = [];
    this.tempMetadata = [];
    this.hoverIndex = -1;

    this.itemSelected = {id: '', name: '', description: '', metadatas: []};
    this.textAreaText = this.itemSelected.description;
  }

  ngOnInit() {
    this.getUserItemList();
  }

  getUserItemList() {
    const userId = localStorage.getItem('currentUser');
    const filter = {
      where: { clientId: userId, isDeleted: true},
      include: 'metadatas',
    };

    this.docapi.find(filter).subscribe((docList) => {
      this.data = docList;
      this.dataFiltered = this.data;
      console.log('ngOnInit findById data: ', docList);
    }, (error) => {
      console.log('Wtf dude', error);
    });
  }

  getFilter(filter: string) {
    switch (filter) {
      case 'name': this.filters[0] = !this.filters[0]; break;
      case 'description': this.filters[1] = !this.filters[1]; break;
      case 'metadata': this.filters[2] = !this.filters[2]; break;
    }

    this.getSearch(this.searchValue);
  }

  getDocIDbyName(name: string) {
    this.docapi.find().subscribe(docArray => {
      docArray.forEach(doc => {
        let docname = doc[0].name;
        console.log(docname);
        if(docname == name) {
          return doc[0].id;
        }
      })
    }, err => { console.log('getDocIDbyName ERROR: ', err); })
  }

  getSearch(search: string) {
    this.searchValue = search;

    this.dataFiltered = this.data.filter((elem: any) => {
      let res = false;
      /* Filtrando por nombre */
      if (this.filters[0]) { res = res || elem.name.toLowerCase().startsWith(search.toLowerCase()); }
      /* Filtrando por Descripción */
      if (this.filters[1]) { res = res || elem.description.toLowerCase().includes(search.toLowerCase()); }
      /* Filtrando por metadata */
      if (this.filters[2]) {
      Object.keys(elem.metadata).forEach(element => {
       // res = res || element.toLowerCase().includes(search.toLowerCase()); // Buscamos la clave
          res = res || elem.metadata[element].toLowerCase().includes(search.toLowerCase()); // Buscamos el valor
      });
      }
      return res;
    });
  }

  itemPressed(data: any) {
    this.itemSelected = data;
    this.metadata = this.itemSelected.metadatas;
    this.tempMetadata = this.itemSelected.metadatas;

    this.textarea.nativeElement.value = this.itemSelected.description; // Necesario (porque es un textarea ?)
  }



  postMetadata(metadata: any): Observable<HttpEvent<any>> {

    const endpoint = 'http://localhost:3000/api/metadata';

    const params = new HttpParams();
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');

    const options = {
      params,
      reportProgress: true,
      headers
    };

    const req = new HttpRequest('POST', endpoint, metadata, options);

    return this.http.request(req);
  }

  newMetadata() {
    this.tempMetadata.push({key: '', value: '', documentId: this.itemSelected.id});
   // console.log(this.tempMetadata);
  }

  updateMetadataKey(event: any, id: any) {
    this.tempMetadata[id].key = event.target.value;
  }
  updateMetadataValue(event: any, id: any) {
    this.tempMetadata[id].value = event.target.value;
  }

  upload() {
    console.log('postFile');
  }

  downloadFile(document) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    console.log(document);
    this.http.get(`http://localhost:3000/api/Documents/${document.id}/download`,
      {responseType: 'arraybuffer', headers}).subscribe((data: any) => {
        const blob = new Blob([data], {type: document.type});
        const url = window.URL.createObjectURL(blob);

        saveAs(blob, document.name);
        window.open(url);
      });
  }

  move2Home(doc: any ){
      /* update database */
      this.docapi.replaceOrCreate( {id: doc.id,
        name: doc.name, description: doc.description, path: doc.path,
        clientId: doc.clientId, type: doc.type, size: doc.size, isDeleted: false}).subscribe(
          (no) => {
            this.showFileMove2HomeMessage();
            setTimeout(() => {this.closeMessagefileMove2Home();}, 5000);
          },
          (err) => {console.log('me cago en', err); }

      );
      this.getUserItemList();
  }

  deletedFile(id: any ){
    /* update database */
    this.docapi.deleteById(id).subscribe(
        (no) => {
          this.showFileDeletedFileMessage();
          setTimeout(() => {this.closeMessagefileDeletedFile();}, 5000);
        },
        (err) => {console.log('me cago en', err); }

    );
    this.getUserItemList();
}

  deletedAllFile(){
    const dialogConfig = new MatDialogConfig();
 // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';

    this.dialog.open(VentanaalertComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {
         this.getUserItemList();
       });
  }
/*
  downloadFromServer(documentId: string) {

    const endpoint = ;
    const formData: FormData = new FormData();

    let params = new HttpParams();
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');
   // headers.append('Content-Type', 'multipart/form-data');

    const options = {
      params: params,
      reportProgress: true,
      headers: headers
    };

    const req = new HttpRequest('GET', endpoint, formData, options);

    return this.http.request(req);
  }
*/

  showDownloadButton(buttonId: any) {
    document.getElementById('downloadButton-' + buttonId).style.display = 'block';
  }

  hideDownloadButton(buttonId: any) {
    document.getElementById('downloadButton-' + buttonId).style.display = 'none';
  }

  showPapperBinButton(buttonId: any) {
    document.getElementById('papperBinButton-' + buttonId).style.display = 'block';
  }

  hidePapperBinButton(buttonId: any) {
    document.getElementById('papperBinButton-' + buttonId).style.display = 'none';
  }

  showRecoverButton(buttonId: any){
    document.getElementById('recoverButton-' + buttonId).style.display = 'block';
  }

  hideRecoverButton(buttonId: any){
    document.getElementById('recoverButton-'+ buttonId).style.display = 'none';
  }

  showFileMove2HomeMessage() {
    document.getElementById('fileMove2Home').style.display = 'block';
    setTimeout(() => {
      document.getElementById('fileMove2Home').style.display = 'none';
    }, 3000);
  }

  closeMessagefileMove2Home(){
    document.getElementById('fileMove2Home').style.display = 'none';
  }

  showFileDeletedFileMessage() {
    document.getElementById('fileDeletedFile').style.display = 'block';
  }

  closeMessagefileDeletedFile(){
    document.getElementById('fileDeletedFile').style.display = 'none';
  }


}
