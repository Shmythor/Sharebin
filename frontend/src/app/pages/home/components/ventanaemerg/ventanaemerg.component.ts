import { Component, OnInit } from '@angular/core';
//import { HttpClient, HttpEventType } from '@angular/common/http';
import { ClientApi, DocumentApi } from '../../../../services/lb-api/services/index';
import { ModalService } from '../../../../shared/_modal';

@Component({
  selector: 'app-ventanaemerg',
  templateUrl: './ventanaemerg.component.html',
  styleUrls: ['./ventanaemerg.component.css']
})
export class VentanaemergComponent implements OnInit {

  selectedFile = null;
  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  bodyText: string;

  constructor(private clientapi: ClientApi, private modalService: ModalService){}

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {

    if(this.bodyText == ""){
      this.bodyText = this.fileData.name;
    }

    this.onUpload(this.bodyText);
    console.log("Upload ejecutado");
    console.log("Cerrando modal...");
    this.modalService.close(id);
  }

  /*onFileSelected (event){

    this.selectedFile = event.target.files[0];

    console.log(event);
  }*/
 
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

  onUpload(fileDescription: string){
    //console.log('Subida de archivo con exito al mundo cuántico');
    
    //const fd = new FormData();
    //fd.append('image', this.selectedFile, this.selectedFile.name)
    /*this.http.post('http://localhost:4200/',fd, {
      reportProgress: true,
      observe: 'events'}).subscribe(event => {

      if(event.type === HttpEventType.UploadProgress){

        console.log('Progreso de Subida: ' + Math.round( event.loaded / event.total) * 100 + '%');
        
      }
      else if (event.type === HttpEventType.Response){
        console.log(event);
      }
     
    })*/

    console.log("Entramos en upload");
    this.clientapi.uploadDocument(this.fileData, {description:fileDescription}, localStorage.getItem("currentUser"))
      .subscribe((res) => {
        console.log(res);
        //this.uploadedFilePath = res.data.filePath;
        alert('SUBIDO!!');
      }, (err) => {
        console.log("Error");
    })
  }  

  ngOnInit() {

  }
}
