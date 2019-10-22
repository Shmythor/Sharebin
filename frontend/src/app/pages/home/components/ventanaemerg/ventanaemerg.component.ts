import { Component, OnInit } from '@angular/core';
//import { HttpClient, HttpEventType } from '@angular/common/http';
import { ClientApi, DocumentApi } from '../../../../services/lb-api/services/index';
import { ModalService } from '../../../../shared/_modal';
import { Observable } from 'rxjs';
import { HttpRequest, HttpParams, HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-ventanaemerg',
  templateUrl: './ventanaemerg.component.html',
  styleUrls: ['./ventanaemerg.component.css']
})
export class VentanaemergComponent implements OnInit {

  selectedFile = null;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  bodyText: string;

  constructor(private clientapi: ClientApi, private modalService: ModalService, private http: HttpClient){}

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {

    this.bodyText = this.fileData.name;

    this.onUpload(this.bodyText);
    this.modalService.close(id);
  }

  ngOnInit() {

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
      params: params,
      reportProgress: true,
      headers: headers
    };

    const req = new HttpRequest('POST', endpoint, formData, options);

    return this.http.request(req);
  }

  onUpload(fileDescription: string) {
    fileDescription = this.fileData.name;
    this.postFile(this.fileData, localStorage.getItem('currentUser'), fileDescription)
    .subscribe((document) => {
      /* pasan cosas */
    }, (err) => {
      console.log('Error al subir documento: ' + err);
    });
  }
}
