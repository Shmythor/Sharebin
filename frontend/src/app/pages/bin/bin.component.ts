import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DocumentApi, ClientApi, MetadataApi } from '../../services/lb-api/services/index';
import { VentanaemergComponent} from 'src/app/pages/home/components/ventanaemerg/ventanaemerg.component';
import { Observable } from 'rxjs';
import { HttpRequest, HttpParams, HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { saveAs } from '../../../../node_modules/file-saver/src/FileSaver.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('textarea', {static: false}) textarea: ElementRef;
  @ViewChild('nameInput', {static: false}) nameInput: ElementRef;

  /*
    filters[0]: name
    filters[1]: description
    filters[2]: metadata
  */
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
      where: { clientId: userId },
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


  saveChanges() {
    const lastItemSelected = this.itemSelected;

    if (this.itemSelected.id !== '') {
      const index = this.data.findIndex((x) => x.id === lastItemSelected.id);

      /* update local data */
      this.data[index].name = this.nameInput.nativeElement.value;
      this.data[index].description = this.textarea.nativeElement.value;
      this.data[index].metadatas = this.tempMetadata;

      /* update database */
      /* aqui quiero hacer el post */
      this.tempMetadata.forEach((elem) => {
        this.metapi.patchOrCreate({key: elem.key, value: elem.value, documentId: elem.documentId}).subscribe(
          (no)=>{},
          (err)=>{console.log('me cago en', err)}
        );
      })
    }
  }

  postMetadata(metadata: any): Observable<HttpEvent<any>> {

    const endpoint = 'http://localhost:3000/api/metadata';

    let params = new HttpParams();
    let headers = new HttpHeaders();

    headers.append("Content-Type", "application/json");

    const options = {
      params: params,
      reportProgress: true,
      headers: headers
    };

    const req = new HttpRequest('POST', endpoint, metadata, options);

    return this.http.request(req);
  }

  newMetadata() {
    this.tempMetadata.push({key: '', value: '', documentId: this.itemSelected.id});
    console.log(this.tempMetadata);
  }

  updateMetadataKey(event: any, id: any) {
    this.tempMetadata[id][0] = event.target.value;
  }
  updateMetadataValue(event: any, id: any) {
    this.tempMetadata[id][1] = event.target.value;
  }

  loadUploadModal() {
    const dialogConfig = new MatDialogConfig();
 // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';

    this.dialog.open(VentanaemergComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {
      this.getUserItemList();
    });
  }

  upload() {
    console.log('postFile');
  }

  downloadFile(documentId: string) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    this.http.get(`http://localhost:3000/api/Documents/${documentId}/download`, 
      {responseType: 'arraybuffer',headers:headers}).subscribe((data: any) => {
        var blob = new Blob([data]);
        var url = window.URL.createObjectURL(blob);

        saveAs(blob,"ostiaputa");
        window.open(url);
      });
  }

  move2PapperBin(documentId: string ){
    /*
    Necesito aqui llamar a la función que cambia un documento de la lista normal a la pappelera
    */
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
}
