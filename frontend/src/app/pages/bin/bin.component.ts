import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DocumentApi, ClientApi, MetadataApi } from '../../services/lb-api/services/index';
import { ModalService } from '../../shared/_modal';
import { VentanaalertComponent } from 'src/app/pages/bin/ventanaalert/ventanaalert.component';
import { HttpClient, HttpEvent, HttpParams, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { saveAs } from '../../../../node_modules/file-saver/src/FileSaver.js';
import { HideAndSeekService } from 'src/app/services/hide-and-seek.service';

import { testData } from '../home/datasource';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})

export class BinComponent implements OnInit {
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
             public hideAndSeekService: HideAndSeekService, private dialogService: DialogService) {
    this.data = [];
    this.dataFiltered = [];
    this.metadata = [];
    this.tempMetadata = [];
    this.hoverIndex = -1;
    this.dataOrder = '';

    this.itemSelected = {id: '', name: '', description: '', metadatas: []};
    this.textAreaText = this.itemSelected.description;

    document.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).id.indexOf('file') < 0 && (event.target as HTMLElement).id.indexOf('dataEditionPanel') < 0 &&
      document.getElementById('dataEditionPanel').style.display === 'block') {
        document.getElementsByClassName('table')[0].setAttribute('style', 'width: 100%; float: left;');
        document.getElementById('dataEditionPanel').style.display = 'none';
      }
   });
  }

  ngOnInit() {
    this.datos = testData;
    this.getUserItemList();
  }

  deleteSortIcons() {
    if (document.getElementById('sortUpIcon') != null) {
      document.getElementById('sortUpIcon').remove();
    }

    if (document.getElementById('sortDownIcon') != null) {
      document.getElementById('sortDownIcon').remove();
    }
  }

  sortNameColumn() {
    if (this.dataOrder.indexOf('name') < 0) {
      this.dataOrder = '';
      this.deleteSortIcons();
    }

    if (this.dataOrder.indexOf('ASC') < 0 && this.dataOrder.indexOf('DESC') < 0) {
      this.dataOrder = 'name ASC';
      document.getElementById('nameColumn').innerHTML += ' <img id="sortUpIcon" src="../../../assets/icons/sort-up.svg" width="10">';
    } else if (this.dataOrder.indexOf('ASC') >= 0) {
      this.dataOrder = 'name DESC';
      document.getElementById('sortUpIcon').remove();
      document.getElementById('nameColumn').innerHTML += ' <img id="sortDownIcon" src="../../../assets/icons/sort-down.svg" width="10">';
    } else {
      this.dataOrder = '';
      document.getElementById('sortDownIcon').remove();
    }
  }

  sortCreateDateColumn() {
    if (this.dataOrder.indexOf('createDate') < 0) {
      this.dataOrder = '';
      this.deleteSortIcons();
    }

    if (this.dataOrder.indexOf('ASC') < 0 && this.dataOrder.indexOf('DESC') < 0) {
      this.dataOrder = 'createDate ASC';
      document.getElementById('createDateColumn').innerHTML += 
      '<img id="sortUpIcon" src="../../../assets/icons/sort-up.svg" width="10">';

    } else if (this.dataOrder.indexOf('ASC') >= 0) {
      this.dataOrder = 'createDate DESC';
      document.getElementById('sortUpIcon').remove();
      document.getElementById('createDateColumn').innerHTML +=
        '<img id="sortDownIcon" src="../../../assets/icons/sort-down.svg" width="10">';

    } else {
      this.dataOrder = '';
      document.getElementById('sortDownIcon').remove();
    }
  }

  sortUpdateDateColumn() {
    if (this.dataOrder.indexOf('updateDate') < 0) {
      this.dataOrder = '';
      this.deleteSortIcons();
    }

    if (this.dataOrder.indexOf('ASC') < 0 && this.dataOrder.indexOf('DESC') < 0) {
      this.dataOrder = 'updateDate ASC';
      document.getElementById('updateDateColumn').innerHTML += 
      '<img id="sortUpIcon" src="../../../assets/icons/sort-up.svg" width="10">';

    } else if (this.dataOrder.indexOf('ASC') >= 0) {
      this.dataOrder = 'updateDate DESC';
      document.getElementById('sortUpIcon').remove();
      document.getElementById('updateDateColumn').innerHTML +=
      '<img id="sortDownIcon" src="../../../assets/icons/sort-down.svg" width="10">';

    } else {
      this.dataOrder = '';
      document.getElementById('sortDownIcon').remove();
    }
  }

  changeOrder(event: any) {
    if (event.target.id === 'nameColumn') {
      this.sortNameColumn();
    } else if (event.target.id === 'createDateColumn') {
      this.sortCreateDateColumn();
    } else if (event.target.id === 'updateDateColumn') {
      this.sortUpdateDateColumn();
    } else {
      console.log('No data order filter!');
      return;
    }
    this.getUserItemList();
  }

  getUserItemList() {
    const userId = localStorage.getItem('currentUser');
    const filter = {
      order: this.dataOrder,
      where: { clientId: userId, isDeleted: true},
      include: 'metadatas',
    };

    this.docapi.find(filter).subscribe((docList) => {
      this.data = docList;
      this.dataFiltered = this.data;
      // console.log('ngOnInit findById data: ', docList);
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
    // Reducir el ancho de la tabla de ficheros
    document.getElementsByClassName('table')[0].setAttribute('style', 'width: 70%; float: left;');
    document.getElementById('dataEditionPanel').style.display = 'block';

    this.itemSelected = data;
    this.metadata = this.itemSelected.metadatas;
    this.tempMetadata = this.itemSelected.metadatas;

    this.textarea.nativeElement.value = this.itemSelected.description; // Necesario (porque es un textarea ?)
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


  shareFile(document) {
    this.resetShareModal();
    this.modalService.open('shareURLModal');
    this.docapi.createURL(document.id).subscribe((docURL) => {
      this.setupModal(docURL);
      this.modalService.open('shareURLModal');
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
  fileSelected(file: string) {
    if (document.getElementsByClassName('selectedFile')[0] != null) {
      document.getElementsByClassName('selectedFile')[0].classList.remove('selectedFile');
    }

    document.getElementById(file).classList.add('selectedFile');
  }

  move2Home(doc: any ) {
    /* update database */
    this.docapi.replaceOrCreate( {id: doc.id,
      name: doc.name, description: doc.description, path: doc.path,
      clientId: doc.clientId, type: doc.type, size: doc.size, isDeleted: false}).subscribe(
        (no) => {
          this.itemSelected = {id: '', name: '', description: '', metadatas: []};
          this.hideAndSeekService.showFileMove2HomeMessage();
          setTimeout(() => {this.hideAndSeekService.closeMessagefileMove2Home(); }, 2500);
          this.getUserItemList();
        },
        (err) => { console.log('me cago en', err); }

    );
    //this.getUserItemList();
}

deletedFile(id: any ) {
  /* open confirmation dialog */
  this.dialogService.openConfirmDialog()
  .afterClosed().subscribe(res =>{
    if(res){
      /* update database */
      this.docapi.deleteById(id).subscribe(
        (no) => {
          this.itemSelected = {id: '', name: '', description: '', metadatas: []};
          this.hideAndSeekService.showFileDeletedFileMessage();
          setTimeout(() => { this.hideAndSeekService.closeMessagefileDeletedFile(); }, 2500);
          this.getUserItemList();
        },
        (err) => { console.log('me cago en', err); }

      );
    }
  })

  
}

deletedAllFile() {
  const dialogConfig = new MatDialogConfig();
// dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '50%';

  this.dialog.open(VentanaalertComponent, dialogConfig);
  this.dialog.afterAllClosed.subscribe(() => {
    this.itemSelected = {id: '', name: '', description: '', metadatas: []};
    this.getUserItemList();
  });
}
}
