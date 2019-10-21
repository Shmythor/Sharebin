import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { dataToTest } from './data.js';
import { ClientApi, DocumentApi } from '../../services/lb-api/services/index';
import { VentanaemergComponent} from 'src/app/pages/home/components/ventanaemerg/ventanaemerg.component';
import { Observable } from 'rxjs';
import { HttpRequest, HttpParams, HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';

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


  public data = [];
  public dataFiltered = [];
  public itemSelected: any;
  public textAreaText: string;
  metadata: any;
  tempMetadata: any;
  searchValue: string;
  metadataKeys: any;
  hoverIndex:number = -1;


 constructor(private clientapi: ClientApi, private docapi: DocumentApi, public dialog: MatDialog, private http: HttpClient) {
    this.data = dataToTest;
    this.dataFiltered = this.data;
    this.itemSelected = {id: '', name: '', description: '', metadata: {}};
    this.metadata = {};
    this.tempMetadata = {};

    this.textAreaText = this.itemSelected.description;
  }

  ngOnInit() {
    let userId = localStorage.getItem("currentUser");
    let filter = {
      where: { clientId: userId},
      includes: "documents"
    }
    this.docapi.find(filter).subscribe((docList) => {
      console.log('ngOnInit findById data: ', docList);
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
    this.metadata = this.convertObjToArray( this.itemSelected.metadata);
    this.tempMetadata = this.metadata;

    this.textarea.nativeElement.value = this.itemSelected.description; // Necesario (porque es un textarea ?)
  }


  saveChanges() {
    const lastItemSelected = this.itemSelected;

    if (this.itemSelected.id !== '') {
      const index = this.data.findIndex((x) => x.id === lastItemSelected.id);

      this.data[index].name = this.nameInput.nativeElement.value;
      this.data[index].description = this.textarea.nativeElement.value;
      this.data[index].metadata = this.convertArrayToObj(this.tempMetadata);
    }
  }

  newMetadata() {
    this.tempMetadata.push(['', '']);
  }

  updateMetadataKey(event: any, id: any) {
    this.tempMetadata[id][0] = event.target.value;
  }
  updateMetadataValue(event: any, id: any) {
    this.tempMetadata[id][1] = event.target.value;
  }

  convertObjToArray(obj: any) {
    return Object.keys(obj).map((key) => {
      return [key, obj[key]];
    });
  }

  convertArrayToObj(array: any) {
    const newObject = {};

    array.forEach(elem => {
      newObject[elem[0]] = elem[1];
    });
    return newObject;
  }

  onCreate(){
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';

    this.dialog.open(VentanaemergComponent, dialogConfig);
  }

<<<<<<< HEAD
=======
  upload() {
    console.log("postFile");
    
  }

>>>>>>> origin/development
  downloadFile(url: string){
    console.log('Descargar ' + url);
    window.open('../../../assets/favicon-32x32.png');
  }

  showDownloadButton(buttonId: any) {
    document.getElementById('downloadButton' + buttonId).style.display = 'block';
  }

  hideDownloadButton(buttonId: any) {
    document.getElementById('downloadButton' + buttonId).style.display = 'none';
  }
<<<<<<< HEAD
=======

fileData: File = null;
previewUrl:any = null;
fileUploadProgress: string = null;
uploadedFilePath: string = null;
 
fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.preview();
}
 
preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
}
 

postFile(fileToUpload: File, clientId: any, description: any): Observable<HttpEvent<any>> {

  console.log("postFile");

  const endpoint = `http://localhost:3000/api/Clients/${clientId}/uploadDocument`;
  const formData: FormData = new FormData();
  formData.append('file', fileToUpload, fileToUpload.name);
  formData.append('description', description);


  let params = new HttpParams();
  let headers = new HttpHeaders();

  headers.append("Content-Type", "application/json");
  headers.append("Content-Type", "multipart/form-data");

  const options = {
    params: params,
    reportProgress: true,
    headers: headers
  };

  const req = new HttpRequest('POST', endpoint, formData, options);

  return this.http.request(req);
  }

onUpload() {
  console.log("onUpload");
  this.postFile(this.fileData, localStorage.getItem('currentUser'), "descripcion aqui ").subscribe((document) => {
    /* AQUI YA SE HA SUBIDO EL FICHERO. RECARGAR LISTA Y DEMASES. */
  });
}
>>>>>>> origin/development
}
