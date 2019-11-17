import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DocumentApi, ClientApi, MetadataApi } from '../../services/lb-api/services/index';
import { VentanaemergComponent} from 'src/app/pages/home/components/ventanaemerg/ventanaemerg.component';
import { ModalService } from '../../shared/_modal';
import { HttpClient, HttpEvent, HttpParams, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { saveAs } from '../../../../node_modules/file-saver/src/FileSaver.js';
import { HideAndSeekService } from 'src/app/services/hide-and-seek.service';

import { testData } from './datasource';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('textarea', {static: false}) textarea: ElementRef;
  @ViewChild('nameInput', {static: false}) nameInput: ElementRef;

  public datos: Object[];

  /*
    filters[0]: name
    filters[1]: description
    filters[2]: metadata
  */
  filters = [true, false, false];


  data: any;
  dataOrder: string;
  dataFiltered: any;
  itemSelected: any;
  textAreaText: string;
  metadata: any;
  tempMetadata: any;
  searchValue: string;
  hoverIndex: number;


 constructor(private clientapi: ClientApi, private docapi: DocumentApi, private metapi: MetadataApi,
             public dialog: MatDialog, private http: HttpClient, private modalService: ModalService,
             public hideAndSeekService: HideAndSeekService) {
    this.data = [];
    this.dataFiltered = [];
    this.metadata = [];
    this.tempMetadata = [];
    this.hoverIndex = -1;
    this.dataOrder = "";

    this.itemSelected = {id: '', name: '', description: '', metadatas: []};
    this.textAreaText = this.itemSelected.description;

    document.addEventListener('click', function(event) {
      if((event.target as HTMLElement).id.indexOf("file") < 0 && (event.target as HTMLElement).id.indexOf("dataEditionPanel") < 0 && document.getElementById("dataEditionPanel").style.display == "block"){
        document.getElementsByClassName("table")[0].setAttribute("style", "width: 100%; float: left;");
        document.getElementById("dataEditionPanel").style.display = "none";
      }
   });
  }

  ngOnInit() {
    this.datos = testData;
    this.getUserItemList();
  }

  deleteSortIcons(){
    if(document.getElementById("sortUpIcon") != null){
      document.getElementById("sortUpIcon").remove();
    }

    if(document.getElementById("sortDownIcon") != null){
      document.getElementById("sortDownIcon").remove();
    }
  }

  sortNameColumn(){
    if(this.dataOrder.indexOf("name") < 0){
      this.dataOrder = "";
      this.deleteSortIcons();
    }

    if(this.dataOrder.indexOf("ASC") < 0 && this.dataOrder.indexOf("DESC") < 0){
      this.dataOrder = "name ASC";
      document.getElementById("nameColumn").innerHTML += ' <img id="sortUpIcon" src="../../../assets/icons/sort-up.svg" width="10">';
    }else if(this.dataOrder.indexOf("ASC") >= 0){
      this.dataOrder = "name DESC";
      document.getElementById("sortUpIcon").remove();
      document.getElementById("nameColumn").innerHTML += ' <img id="sortDownIcon" src="../../../assets/icons/sort-down.svg" width="10">';
    }else{
      this.dataOrder = "";
      document.getElementById("sortDownIcon").remove();
    }
  }

  sortCreateDateColumn(){
    if(this.dataOrder.indexOf("createDate") < 0){
      this.dataOrder = "";
      this.deleteSortIcons();
    }

    if(this.dataOrder.indexOf("ASC") < 0 && this.dataOrder.indexOf("DESC") < 0){
      this.dataOrder = "createDate ASC";
      document.getElementById("createDateColumn").innerHTML += ' <img id="sortUpIcon" src="../../../assets/icons/sort-up.svg" width="10">';
    }else if(this.dataOrder.indexOf("ASC") >= 0){
      this.dataOrder = "createDate DESC";
      document.getElementById("sortUpIcon").remove();
      document.getElementById("createDateColumn").innerHTML += ' <img id="sortDownIcon" src="../../../assets/icons/sort-down.svg" width="10">';
    }else{
      this.dataOrder = "";
      document.getElementById("sortDownIcon").remove();
    }
  }

  sortUpdateDateColumn(){
    if(this.dataOrder.indexOf("updateDate") < 0){
      this.dataOrder = "";
      this.deleteSortIcons();
    }

    if(this.dataOrder.indexOf("ASC") < 0 && this.dataOrder.indexOf("DESC") < 0){
      this.dataOrder = "updateDate ASC";
      document.getElementById("updateDateColumn").innerHTML += ' <img id="sortUpIcon" src="../../../assets/icons/sort-up.svg" width="10">';
    }else if(this.dataOrder.indexOf("ASC") >= 0){
      this.dataOrder = "updateDate DESC";
      document.getElementById("sortUpIcon").remove();
      document.getElementById("updateDateColumn").innerHTML += ' <img id="sortDownIcon" src="../../../assets/icons/sort-down.svg" width="10">';
    }else{
      this.dataOrder = "";
      document.getElementById("sortDownIcon").remove();
    }
  }

  changeOrder(event:any){
    if(event.target.id == "nameColumn"){
      this.sortNameColumn();
    }else if(event.target.id == "createDateColumn"){
      this.sortCreateDateColumn();
    }else if(event.target.id == "updateDateColumn"){
      this.sortUpdateDateColumn();
    }else{
      console.log("No data order filter!");
      return;
    }
    this.getUserItemList();
  }

  getUserItemList() {
    const userId = localStorage.getItem('currentUser');
    const filter = {
      order: this.dataOrder,
      where: { clientId: userId, isDeleted: false},
      include: 'metadatas',
    };

    this.docapi.find(filter).subscribe((docList) => {
      this.data = docList;
      this.dataFiltered = this.data;
      //console.log('ngOnInit findById data: ', docList);
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
        const docname = doc[0].name;
        console.log(docname);
        if (docname === name) {
          return doc[0].id;
        }
      });
    }, err => { console.log('getDocIDbyName ERROR: ', err); });
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
    //Reducir el ancho de la tabla de ficheros
    document.getElementsByClassName("table")[0].setAttribute("style", "width: 70%; float: left;");
    document.getElementById("dataEditionPanel").style.display = "block";

    this.itemSelected = data;
    this.metadata = this.itemSelected.metadatas;
    this.tempMetadata = this.itemSelected.metadatas;

    this.textarea.nativeElement.value = this.itemSelected.description; // Necesario (porque es un textarea ?)
  }


  saveChanges() {
    const lastItemSelected = this.itemSelected;

    if (this.itemSelected.id !== '') {
      const index = this.data.findIndex((x) => x.id === lastItemSelected.id);
      const dataIdx = this.data[index];
      /* update local data */
      this.data[index].name = this.nameInput.nativeElement.value;
      this.data[index].description = this.textarea.nativeElement.value;
      this.data[index].metadatas = this.tempMetadata;

      /* update database */
      this.docapi.replaceOrCreate( {id: this.data[index].id,
        name: dataIdx.name, description: dataIdx.description, path: dataIdx.path,
        clientId: dataIdx.clientId, type: dataIdx.type, size: dataIdx.size }).subscribe(
          (no) => { console.log('mismuertos'); },
          (err) => {console.log('me cago en', err); }
      );

      this.tempMetadata.forEach((elem) => {
        console.log(elem);
        this.metapi.patchOrCreate({key: elem.key, value: elem.value, documentId: elem.documentId, id: elem.id}).subscribe(
          (no) => {console.log('mismuertos'); },
          (err) => {console.log('me cago en', err); }
        );
      });
    }
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

  move2PapperBin(doc: any ) {
      /* update database */
      this.docapi.replaceOrCreate( {id: doc.id,
        name: doc.name, description: doc.description, path: doc.path,
        clientId: doc.clientId, type: doc.type, size: doc.size, isDeleted: true}).subscribe(
          (no) => {
            this.hideAndSeekService.showFileMove2BinMessage();
            // setTimeout(() => {this.closeMessagefileMove2Bin()}, 5000);
           },
          (err) => {console.log('me cago en', err); }

      );
      this.getUserItemList();
  }

  shareFile(document) {
    this.resetShareModal();
    this.modalService.open('shareURLModal');
    this.docapi.createURL(document.id).subscribe((docURL) => {
      this.setupModal(docURL);
      this.modalService.open("shareURLModal");
    }, (error) => {
      console.log('URL no creada', error);
    });
  }

  setupModal(urlDocumento) {
    const documentShareURL = 'http://localhost:3000/api/documents/downloadByLink/' + urlDocumento;
    (document.getElementById('shareURLContent') as HTMLInputElement).value = documentShareURL;
  }

  closeModal(id: string) {
    this.resetShareModal();
    this.modalService.close(id);
  }

  resetShareModal() {
    (document.getElementById('shareURLContent') as HTMLInputElement).value = '';
    document.getElementById('copyURL').innerHTML = 'Copiar';
    document.getElementById('copyURL').style.background = '#e9ecef';
    document.getElementById('copyURL').style.color = '#51585f';
  }

 copyURL(inputElement) {
    document.getElementById('copyURL').innerHTML = 'Copiado!';
    document.getElementById('copyURL').style.background = '#23b180';
    document.getElementById('copyURL').style.color = '#fff';
    (document.getElementById(inputElement) as HTMLInputElement).select();
    document.execCommand('copy');
  }

  // Resalta la fila del documento pulsado
  // El diseño de la clase selectedFile está en el css
  fileSelected(file: string){
    if (document.getElementsByClassName('selectedFile')[0] != null){
      document.getElementsByClassName('selectedFile')[0].classList.remove('selectedFile');
    }
    // fronted shaheer (17/11/2019)
    document.getElementById(file).classList.add("selectedFile");
    
    //development (17/11/2019)
    //const fileParentNode = document.getElementById(file) as HTMLElement;
    //const node = document.querySelector('#' + file) as HTMLElement;
    //node.parentNode['className'] += ' selectedFile';
  }
}