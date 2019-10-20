import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-ventanaemerg',
  templateUrl: './ventanaemerg.component.html',
  styleUrls: ['./ventanaemerg.component.css']
})
export class VentanaemergComponent implements OnInit {

  selectedFile = null;

  constructor( private http: HttpClient){}

  onFileSelected (event){

    this.selectedFile = event.target.files[0];

    console.log(event);
  }

  onUpload(){
    console.log('Subida de archivo con exito al mundo cuántico');
    
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name)
    this.http.post('http://localhost:4200/',fd, {
      reportProgress: true,
      observe: 'events'}).subscribe(event => {

      if(event.type === HttpEventType.UploadProgress){

        console.log('Progreso de Subida: ' + Math.round( event.loaded / event.total) * 100 + '%');
        
      }
      else if (event.type === HttpEventType.Response){
        console.log(event);
      }
     
    })
  }  

  ngOnInit() {
  }

  

}
