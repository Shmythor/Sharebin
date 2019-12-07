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
import { DialogService } from 'src/app/shared/dialog.service';
import {ComponentCanDeactivate} from 'src/app/shared/component-can-deactivate';

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
  lastDocumentSelected: any;


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
    this.lastDocumentSelected = this.itemSelected;

    document.addEventListener('click', (event) => {
      // Oculta el panel de edición de datos al pulsar fuera del mismo panel,
      // listado de fichero o buscador
      this.editionPanelVisibility(event);
      this.notSavedChanges();

      /**
       * Usando el método de Shaheer, cuando se detecte un click sobre un documento
       * guardar este en una variable global, de tal forma que pueda acceder a sus campos
       * Pero tener cuidado, porque el usuario puede clickar (habiendo hecho cambios) sobre otro documento
       * y no querremos en este caso sobreescribir lasDocumentSelected
       * 
       * Si cliclo en algo que no sea fileSelected, entonces comparo con this.itemSelected lo de la foto
       * y si es en un file entonces me voy al método del item pressed y miro si se han modificado los datos
       * 
       * En su defecto, comparo con la base de datos
       */
    });
  }

  ngOnInit() {
    this.datos = testData;
    this.getUserItemList();
  }

  editionPanelVisibility(event) {
    const searchbarClicked = document.getElementById('searchbarContainer').contains((event.target as HTMLElement));
    const filesClicked = document.getElementById('itemsTable').contains((event.target as HTMLElement));
    const editionPanelClicked = document.getElementById('dataEditionPanel').contains((event.target as HTMLElement));

    if (!searchbarClicked && !filesClicked && !editionPanelClicked && document.getElementById('dataEditionPanel').style.display === 'block') {
      document.getElementsByClassName('table')[0].setAttribute('style', 'width: 100%; float: left;');
      document.getElementById('dataEditionPanel').style.display = 'none';
      
      // Si lo que clicamos es un documento de la lista
    } else if(filesClicked) {
      // si el ultimo documento seleccionado es el incial (no hemos clicado aún ninguno)
      if(this.lastDocumentSelected == {id: '', name: '', description: '', metadatas: []}) {
        console.log("Es el primer documento clicado en la lista");
        this.lastDocumentSelected = this.itemSelected;
      } else { // si el último documento clickado no era el inicial
        this.checkIfUnsavedDocuments();
      }
    } // Si no es un documento de la lista
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
      where: { clientId: userId, isDeleted: false},
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
      Object.keys(elem.metadatas).forEach(idx => {
        const element = elem.metadatas[idx];
       // res = res || element['key'].toLowerCase().includes(search.toLowerCase()); // Buscamos la clave
        res = res || element['value'].toLowerCase().includes(search.toLowerCase()); // Buscamos el valor
      });
      }
      return res;
    });
  }

  itemPressed(event: any, data: any) {
    const isDownload = (event.target as HTMLElement).id == 'downloadButtonIcon';
    const isShare = (event.target as HTMLElement).id == 'shareButtonIcon';
    const isDelete = (event.target as HTMLElement).id == 'deleteButtonIcon';
    // Reducir el ancho de la tabla de ficheros si no se ha pulsado ningún icono
    if (!isDownload && !isShare && !isDelete) {
      document.getElementsByClassName('table')[0].setAttribute('style', 'width: 70%; float: left;');
      document.getElementById('dataEditionPanel').style.display = 'block';

      this.itemSelected = data;
      this.metadata = this.itemSelected.metadatas;
      this.tempMetadata = this.itemSelected.metadatas;

      this.textarea.nativeElement.value = this.itemSelected.description; // Necesario (porque es un textarea ?)
    }
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
      this.docapi.patchAttributes(this.data[index].id, 
        { name: dataIdx.name, description: dataIdx.description, path: dataIdx.path,
        clientId: dataIdx.clientId, type: dataIdx.type, size: dataIdx.size }).subscribe(
          (no) => { console.log('Nothing'); },
          (err) => {console.log('An error ocurred while patching atributes: ', err); }
      );

      this.tempMetadata.forEach((elem) => {
        console.log(elem);
        this.metapi.patchOrCreate({key: elem.key, value: elem.value, documentId: elem.documentId, id: elem.id}).subscribe(
          (no) => {console.log('Nothing'); },
          (err) => {console.log('An error ocurred while patching atributes: ', err); }
        );
      });
    }
    this.showsaveChangeMessage();
    return;
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

  notSavedChanges() {
    let isSaved = this.checkIfUnsavedDocuments();
    console.log("is saved?: ", isSaved);
    if(!isSaved) {
      // Open confirmation dialog 
      const msg = "No has guardado cambios, ¿quiéres hacerlo?\nEn caso contrario, se perderán."
      // this.dialogService.openConfirmDialog(msg)
      // .afterClosed().subscribe(res =>{
      //   if(res){
      //     // Accepted. Save changes
      //     this.saveChanges();
      //   }
      // })  
    }
  }

  // Returns true if the user saved last changes
  // Gets info from last clicked document and compare it with itemSelected
  async checkIfUnsavedDocuments() {
    // To get last document info
    console.log('Last item selected: ', this.lastDocumentSelected);
    const lastDocIndex = this.data.findIndex((x) => x.id === this.lastDocumentSelected.id);
    console.log('Index: ', lastDocIndex);
    let lastDocID = this.data[lastDocIndex].id;
    console.log('Document ID: ', lastDocID);
    
    // Last document info 
    let lastDocName = this.data[lastDocIndex].name
    let lastDocDescription = this.data[lastDocIndex].description 
    let lastDocMetadata = this.data[lastDocIndex].metadatas

    console.log('last Doc name: ', lastDocName,
    '\nlast Doc description: ', lastDocDescription,
    '\nlast Doc metadata: ', lastDocMetadata,
    );
    
    // To get current document info
    console.log('Last item selected: ', this.itemSelected);
    const currentIndex = this.data.findIndex((x) => x.id === this.itemSelected.id);
    console.log('Index: ', currentIndex);
    let currentDocID = this.data[currentIndex].id;
    console.log('Document ID: ', currentDocID);
    
    // Current document info 
    let currentName = this.data[currentIndex].name
    let currentDescription = this.data[currentIndex].description 
    let currentMetadata = this.data[currentIndex].metadatas

    console.log('current Doc name: ', currentName,
    '\ncurrent Doc description: ', currentDescription,
    '\ncurrent Doc metadata: ', currentMetadata,
    );

    let nameChanged = lastDocName != currentName;
    let descChanged = lastDocDescription != currentDescription;
    let metdataChanged = lastDocMetadata.length != currentMetadata.length;

    if(nameChanged || descChanged || metdataChanged) {
        console.log('Pues algo ha cambiado, a ver qué era');
        console.log('¿El nombre? ', nameChanged);
        console.log('¿La descripción? ', descChanged);
        console.log('¿La longitud de los metadatos? ', metdataChanged);
    } else {
      console.log('Parece que de lo general no hay cambios, a ver los metadatos en concreto');
      for(let i = 0; i < lastDocMetadata.length; i++) {
        let lm = lastDocMetadata[0];
        let cm = currentMetadata[0];
        if(lm.key != cm.key) {
          console.log('Ha cambiado una key de ', lm.key, ' a ', cm.key);
        }
        // falta mirar los valores
      }
    }


    // // Variables to store db info
    // let dbName; let dbDescription; let dbMetadata;

    // Tengo que hacer esperas a estos subscribes, 
    // porque ocurren después de que compruebe en el if

    // https://stackoverflow.com/questions/50951779/angular-2-wait-for-subscribe-to-finish-to-update-access-variable

    // // Get document db name
    // this.getDocByID(docID).then((doc) => {
    //   dbName = doc.name;
    //   dbDescription = doc.description;
    //   // dbMetadata = doc.metadata
    //   console.log(`Got db name for ${docID}: ${dbName}`);
    //   console.log(`Got db Description for ${docID}: ${dbDescription}`);
    //   return this.getDocMetadataByID(docID);
    // }).then((md) => {
    //   dbMetadata = md
    //   console.log(`Got db Metadata for ${docID}: ${dbMetadata}`);
    // })
    // .catch((err) => {
    //   console.log("An error ocurred at getDocDBName catch: ", err);
    // })

    // let arr = await this.getStuff(docID);
    // dbName = arr[0];
    // dbDescription = arr[1];
    // dbMetadata = arr[2];

    // console.log("Name or desciption or metadata changed");
    // console.log("localName != dbName ", localName != dbName);
    // console.log("localDescription != dbDescription ", localDescription != dbDescription);
    // console.log("localMetadata.length != dbMetadata.length ", localMetadata.length != dbMetadata.length);

    // if(localName != dbName 
    //   || localDescription != dbDescription 
    //   || localMetadata.length != dbMetadata.length) 
    // {
    //   return false;
    // } else {
    //   console.log("Lets see if metadata changed");
    //   for(let i = 0; i < dbMetadata; i++) {
    //     if(localMetadata[i].key   != dbMetadata[i].key)   { return false; }
    //     if(localMetadata[i].value != dbMetadata[i].value) { return false; }
    //   }
    //   console.log("Returning true");
    //   return true;
    // }
  }

  // getDocDBDescription(docID) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.docapi.findById(docID, null ,(err, doc) => {
  //         if(err) {
  //           console.log("An error ocurred at getDocDBName: ", err);
  //           reject()
  //         } else {
  //           let dbDescription = doc.description;
  //           console.log("Found name: ", dbDescription);
  //           resolve(dbDescription)
  //         }
  //       })
  //     } catch (err) {
  //       console.log("An error ocurred at getDocDBDescription: ", err);
  //       reject(err)
  //     }
  //   })
  // }


  // getStuff(docID) {
  //   let resArr = [];
  //   // Get document db name
  //   return new Promise((resolve, reject) => {
  //     this.getDocByID(docID).then((doc) => {
  //       resArr.push(doc.name);
  //       resArr.push(doc.description);
  //       console.log(`Got db name for ${docID}: ${resArr[0]}`);
  //       console.log(`Got db Description for ${docID}: ${resArr[1]}`);
  //       return this.getDocMetadataByID(docID);
  //     }).then((md) => {
  //       resArr.push(md);
  //       console.log(`Got db Metadata for ${docID}: ${resArr[2]}`);
  //     })
  //     .catch((err) => {
  //       console.log("An error ocurred at getDocDBName catch: ", err);
  //     })
  //   })
  // }

  // getDocByID(docID) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.docapi.find({d: docID}).subscribe((docArray) => {
  //       });
  //     } catch (err) {
  //       console.log("An error ocurred at getDocDBName CATCH: ", err);
  //       reject(err)
  //     }
  //   })
  // }

  getDocMetadataByID(docID) {
    return new Promise((resolve, reject) => {
      try {
        this.docapi.getMetadatas(docID).subscribe((metadata) => {
          console.log("Found metadata by getDocMetadataByID (promise): ", metadata);
          resolve(metadata)
        });
      } catch (err) {
        console.log("An error ocurred at getDocDBName CATCH: ", err);
        reject(err)
      }
    })
  }

  

  // getDocDBMetadata(docID) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.docapi.findById(docID, null ,(err, doc) => {
  //         if(err) {
  //           console.log("An error ocurred at getDocDBName: ", err);
  //           reject()
  //         } else {
  //           let metadata = doc.metadata;
  //           console.log("Found name: ", metadata);
  //           resolve(metadata)
  //         }
  //       })
  //     } catch (err) {
  //       console.log("An error ocurred at getDocDBDoc: ", err);
  //       reject(err)
  //     }
  //   })
  // }

  loadUploadModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';

    this.dialog.open(VentanaemergComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {
      this.getUserItemList();
    });
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
      this.docapi.patchAttributes(doc.id, {isDeleted: true}).subscribe(
          (no) => {
            this.itemSelected = {id: '', name: '', description: '', metadatas: []};
            this.hideAndSeekService.showFileMove2BinMessage();
            this.getUserItemList();
            // setTimeout(() => {this.closeMessagefileMove2Bin()}, 5000);
           },
          (err) => {console.log('me cago en', err); }

      );
      // this.getUserItemList();
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
  showsaveChangeMessage() {
    document.getElementById('confirmChange').style.display = 'block';
    setTimeout(() => {
      document.getElementById('confirmChange').style.display = 'none';
    }, 2000);
  }
}
