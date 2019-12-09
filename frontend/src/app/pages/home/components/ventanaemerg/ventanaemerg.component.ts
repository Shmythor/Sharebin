import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpEventType } from '@angular/common/http';
import { ClientApi, DocumentApi } from '../../../../services/lb-api/services/index';
import { ModalService } from '../../../../shared/_modal';
import { Observable } from 'rxjs';
import { HttpRequest, HttpParams, HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { ThemesService } from '../../../../services/themes.service';

@Component({
  selector: 'app-ventanaemerg',
  templateUrl: './ventanaemerg.component.html',
  styleUrls: ['./ventanaemerg.component.scss']
})
export class VentanaemergComponent implements OnInit {

  selectedFile = null;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  bodyText: string;
  MAX_FILE: number = 20971520;

  constructor(private clientapi: ClientApi, private modalService: ModalService,
    private http: HttpClient, private themesService: ThemesService) {}

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {

    this.bodyText = this.fileData.name;

    this.onUpload(this.bodyText);
    this.modalService.close(id);
  }

  ngOnInit() {
    this.themesService.refreshTheme(true);
  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0] as File;
    this.preview();
  }

  preview() {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  postFile(fileToUpload: File, clientId: any, description: any): Observable<HttpEvent<any>> {
    const endpoint = `http://localhost:3000/api/Clients/${clientId}/uploadDocument`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('description', description);


    const params = new HttpParams();
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');
    headers.append('Content-Type', 'multipart/form-data');

    const options = {
      params,
      reportProgress: true,
      headers
    };

    const req = new HttpRequest('POST', endpoint, formData, options);

    return this.http.request(req);
  }

  onUpload(fileDescription: string) {
    fileDescription = this.fileData.name;
    
    if(this.fileData.size > this.MAX_FILE){
      this.showLimitsUploadMessage();
      return;
    }
   
    this.postFile(this.fileData, localStorage.getItem('currentUser'), fileDescription)
    .subscribe((document) => {
      /* AQUI YA SE HA SUBIDO EL FICHERO. RECARGAR LISTA Y DEMASES. */
      //console.log("Subida hecha");
      //location.reload();
      if(this.fileData.size > 0 && this.fileData.size <= this.MAX_FILE){
        this.showSuccessUploadMessage();
        this.addDataTable(this.fileData);
      }      
    }, (err) => {      
      this.showErrorUploadMessage();
      console.log('Error al subir documento: ' + err);
    });
  }
  addDataTable(data: File) {
    document.getElementById('fileNameTable').innerHTML = '<strong>' + data.name + '</strong>';
    document.getElementById('fileSizeTable').innerHTML = '' + data.size + ' Bytes';
  }

  showSuccessUploadMessage() {
    document.getElementById('fileUploadSuccess').style.display = 'block';
    setTimeout(() => {
      document.getElementById('fileUploadSuccess').style.display = 'none';
    }, 2000);
  }

  showErrorUploadMessage() {
    document.getElementById('fileUploadError').style.display = 'block';
    setTimeout(() => {
      document.getElementById('fileUploadError').style.display = 'none';
    }, 2000);
  }

  showLimitsUploadMessage(){    
    document.getElementById('fileUploadLimit').style.display = 'block';
    setTimeout(() => {
      document.getElementById('fileUploadLimit').style.display = 'none';
    }, 2000);
  }

  //para el drop_zone
  files: File[] = [];
 
  onSelect(event) {
  console.log(event);
  this.files.push(...event.addedFiles);
  }
 
  onRemove(event) {
  console.log(event);
  this.files.splice(this.files.indexOf(event), 1);
  }

  onFilesAdded(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  
    this.readFile(this.files[0]).then(fileContents => {
      // Put this string in a request body to upload it to an API.
      console.log(fileContents);
    }); }
    
  
  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };
  
      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };
  
      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }
  
      reader.readAsDataURL(file);
    });
  }

  

}


