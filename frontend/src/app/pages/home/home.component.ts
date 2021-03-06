import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DocumentApi, MetadataApi, AuditorApi } from '../../services/lb-api/services/index';
import { VentanaemergComponent} from 'src/app/pages/home/components/ventanaemerg/ventanaemerg.component';
import { ModalService } from '../../shared/_modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from '../../../../node_modules/file-saver/src/FileSaver.js';
import { HideAndSeekService } from 'src/app/services/hide-and-seek.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;

  @ViewChild('textarea', {static: false}) textarea: ElementRef;
  @ViewChild('nameInput', {static: false}) nameInput: ElementRef;

  /*
    filters[0]: name
    filters[1]: description
    filters[2]: metadata
  */
  filters = [false, false, false];


  data: any;
  dataOrder: string;
  dataFiltered: any;
  itemSelected: any;
  textAreaText: string;
  metadataList: any;
  multipleMetadataList: any;
  multipleMetadataListIntersected: any;
  multipleMetadataIDList: any;
  auditInfo: any;
  searchValue: string;
  hoverIndex: number;
  lastDocumentSelected: any;

  clientName: string;

  // Variables paginación
  anterior: any;
  siguiente: any;
  primero: any;
  ultimo: any;
  currentPos = 0;
  totalFiles = 0;
  currentPage: number;
  totalPages: number;
  perPage = 5;
  visibleDocs: number = this.perPage;

 constructor(private docapi: DocumentApi, private metapi: MetadataApi, private auditapi: AuditorApi, public dialog: MatDialog,
             private http: HttpClient, private modalService: ModalService, public hideAndSeekService: HideAndSeekService,
             private dialogService: DialogService, public datepipe: DatePipe) {
    this.data = [];
    this.dataFiltered = [];
    this.metadataList = [];
    this.multipleMetadataList = [];
    this.multipleMetadataListIntersected = [];
    this.multipleMetadataIDList = [];
    this.auditInfo = [];
    this.hoverIndex = -1;
    this.dataOrder = '';

    this.itemSelected = {id: '', name: '', description: '', metadatas: []};
    this.textAreaText = this.itemSelected.description;
    this.lastDocumentSelected = {id: '', name: '', description: '', metadatas: []};

    document.addEventListener('click', (event) => {
      // Oculta el panel de edición de datos al pulsar fuera del mismo panel,
      // listado de fichero o buscador
      // console.log(document.getElementById('dataEditionPanel').contains((event.target as HTMLElement)));
      // if(!document.getElementById('themes-section').contains((event.target as HTMLElement))){
        // console.log("Distinto temas");
        this.editionPanelVisibility(event);
      // }
    });
  }

  ngOnInit() {
    this.anterior = document.getElementById('anterior');
    this.siguiente = document.getElementById('siguiente');
    this.primero = document.getElementById('firstPage');
    this.ultimo = document.getElementById('lastPage');

    this.getUserItemList();
  }

  detectChange(event: any) {
    this.saveChanges();
  }

  editionPanelVisibility(event) {
    let searchbarClicked = false;
    let filesClicked = false;
    let editionPanelClicked = false;
    let editionPanelVisible = false;

    if (document.getElementById('searchbarContainer') != null) {
      searchbarClicked = document.getElementById('searchbarContainer').contains((event.target as HTMLElement));
    }

    if (document.getElementById('itemsTable') != null) {
      filesClicked = document.getElementById('itemsTable').contains((event.target as HTMLElement));
    }

    if (document.getElementById('dataEditionPanel') != null) {
      editionPanelVisible = document.getElementById('dataEditionPanel').style.display === 'block';
      editionPanelClicked = document.getElementById('dataEditionPanel').contains((event.target as HTMLElement));
    }

    if (!searchbarClicked && !filesClicked && !editionPanelClicked && editionPanelVisible) {

      if (document.getElementsByClassName('table').length > 0) {
        document.getElementsByClassName('table')[0].setAttribute('style', 'width: 100%; float: left;');
        if (document.getElementById('dataEditionPanel') != null) {
          document.getElementById('dataEditionPanel').style.display = 'none';
        }
      }
    }
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
      document.getElementById('nameColumn').innerHTML +=
      '&nbsp;<img id="sortUpIcon" src="../../../assets/icons/sort-up.svg" width="10">';
    } else if (this.dataOrder.indexOf('ASC') >= 0) {
      this.dataOrder = 'name DESC';
      document.getElementById('sortUpIcon').remove();
      document.getElementById('nameColumn').innerHTML +=
      '&nbsp;<img id="sortDownIcon" src="../../../assets/icons/sort-down.svg" width="10">';
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
      '&nbsp;<img id="sortUpIcon" src="../../../assets/icons/sort-up.svg" width="10">';

    } else if (this.dataOrder.indexOf('ASC') >= 0) {
      this.dataOrder = 'createDate DESC';
      document.getElementById('sortUpIcon').remove();
      document.getElementById('createDateColumn').innerHTML +=
        '&nbsp;<img id="sortDownIcon" src="../../../assets/icons/sort-down.svg" width="10">';

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
      '&nbsp;<img id="sortUpIcon" src="../../../assets/icons/sort-up.svg" width="10">';

    } else if (this.dataOrder.indexOf('ASC') >= 0) {
      this.dataOrder = 'updateDate DESC';
      document.getElementById('sortUpIcon').remove();
      document.getElementById('updateDateColumn').innerHTML +=
      '&nbsp;<img id="sortDownIcon" src="../../../assets/icons/sort-down.svg" width="10">';

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
      limit: this.perPage,
      skip: this.currentPos,
      order: this.dataOrder,
      where: { clientId: userId, isDeleted: false},
      include: 'metadatas',
    };

    this.docapi.find(filter).subscribe((docList) => {
      this.data = docList;
      this.dataFiltered = this.data;

      this.updatePaginationInfo(docList.length);
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

  // Updates pagination pages text on clicks
  updatePaginationInfo(docsView: number) {
    this.anterior.setAttribute('disabled', 'disabled');
    this.siguiente.setAttribute('disabled', 'disabled');
    this.primero.setAttribute('disabled', 'disabled');
    this.ultimo.setAttribute('disabled', 'disabled');

    // Guarda los documentos que están visibles
    this.visibleDocs = docsView;

    // Comprueba si ya no hay ficheros en la tabla
    if (this.visibleDocs === 0) {
      // Si ya no hay más páginas, quita la paginación
      if (this.anterior.hasAttribute('disabled')) {
        document.getElementById('paginationContainer').style.display = 'none';
        // console.log("No hay documentos a mostrar!");
        if (this.totalPages > 1) {
          this.pagAnterior();
        }
      } else {
        // Si quedan páginas, vuelve a la anterior
        this.pagAnterior();
      }
      return;
    }

    // Obtenemos el número total de documentos disponibles y actualizamos los datos de paginación
    this.docapi.count({isDeleted: false}).subscribe(docCount => {
      this.totalFiles = docCount.count;
      // this.updatePaginationInfo();

      // Cálculo de página actual y total de páginas
      this.currentPage = Math.ceil(this.currentPos / this.perPage) + 1;
      this.totalPages = Math.ceil(this.totalFiles / this.perPage);

      if (this.currentPos > 0) {
        this.anterior.removeAttribute('disabled');
        this.primero.removeAttribute('disabled');
      }

      if (this.currentPos + this.perPage < this.totalFiles) {
        this.siguiente.removeAttribute('disabled');
        this.ultimo.removeAttribute('disabled');
      }

      if (this.totalPages > 1) {
        document.getElementById('currentPage').innerHTML = '' + this.currentPage;
        document.getElementById('totalPages').innerHTML = '' + this.totalPages;
        document.getElementById('paginationContainer').style.display = 'block';
      }
    }, err => { console.log('docCount ERROR: ', err); });
    // console.log(this.totalFiles +" " +this.totalPages +" " +this.currentPos);

    if (this.anterior.hasAttribute('disabled')
      && this.siguiente.hasAttribute('disabled')
      && this.primero.hasAttribute('disabled')
      && this.ultimo.hasAttribute('disabled')) {
        document.getElementById('paginationContainer').style.display = 'none';
    }
  }

  // Botón paginación de ir a la priemra página
  firstPage() {
    this.currentPos = 0;
    this.getUserItemList();
  }

  // Botón paginación de ir a la última página
  lastPage() {
    this.currentPos = (this.perPage * this.totalPages) - this.perPage;
    this.getUserItemList();
  }

  // Botón paginación de ir a la página anterior
  pagAnterior() {
    this.currentPos -= this.perPage;
    this.getUserItemList();
  }

  // Botón paginación de ir a la siguiente página
  pagSiguiente() {
    this.currentPos += this.perPage;
    this.getUserItemList();
  }

  getDocIDbyName(name: string) {
    this.docapi.find().subscribe(docArray => {
      docArray.forEach(doc => {
        const docname = doc[0].name;
        if (docname === name) {
          return doc[0].id;
        }
      });
    }, err => { console.log('getDocIDbyName ERROR: ', err); });
  }

  getSearch(search: string) {
    const allFiltersActive = !this.filters[0] && !this.filters[1] && !this.filters[2];
    this.searchValue = search;

    this.dataFiltered = this.data.filter((elem: any) => {
      let res = false;
      /* Filtrando por nombre */
      if (this.filters[0] || allFiltersActive) { res = res || elem.name.toLowerCase().startsWith(search.toLowerCase()); }
      /* Filtrando por Descripción */
      if (this.filters[1] || allFiltersActive) { res = res || elem.description.toLowerCase().includes(search.toLowerCase()); }
      /* Filtrando por metadata */
      if (this.filters[2] || allFiltersActive) {
        Object.keys(elem.metadatas).forEach(idx => {
          const element = elem.metadatas[idx];
        // res = res || element['key'].toLowerCase().includes(search.toLowerCase()); // Buscamos la clave
          res = res || element.value.toLowerCase().includes(search.toLowerCase()); // Buscamos el valor
        });
      }

      return res;
    });
  }

  itemPressed(event: any, data: any) {
    const isDownload = (event.target as HTMLElement).id === 'downloadButtonIcon';
    const isShare = (event.target as HTMLElement).id === 'shareButtonIcon';
    const isDelete = (event.target as HTMLElement).id === 'deleteButtonIcon';
    const isFavourite = (event.target as HTMLElement).id === 'favouriteButtonIcon';

    // Reducir el ancho de la tabla de ficheros si no se ha pulsado ningún icono
    if (!isDownload && !isShare && !isDelete && !isFavourite) {

      if (document.getElementsByClassName('table').length > 0) {
        document.getElementsByClassName('table')[0].setAttribute('style', 'width: 70%; float: left;');
      }

      if (document.getElementById('dataEditionPanel') != null) {
        document.getElementById('dataEditionPanel').style.display = 'block';
      }

      this.itemSelected = data;
      this.metadataList = this.itemSelected.metadatas;
      this.getAuditInfo();

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
      this.data[index].metadatas = this.metadataList;
      // Actualizamos con los valores de la lista de metadatos múltiples
      this.data[index].metadatas.forEach(metadata => {
        const metaId = metadata.id;
        const metaInMultipleList = this.multipleMetadataList.find(met => met.id === metaId);
        if (metaInMultipleList !== undefined) {
          metadata = metaInMultipleList;
        }
      });

      /* update database */
      this.docapi.patchAttributes(this.data[index].id, { name: dataIdx.name, description: dataIdx.description, path: dataIdx.path,
        clientId: dataIdx.clientId, type: dataIdx.type, size: dataIdx.size }).subscribe(
          () => { console.log('docApi actualizada'); },
          (err) => {console.log('An error ocurred while patching atributes: ', err); }
      );

      this.metadataList.forEach((elem) => {
        this.metapi.patchOrCreate({key: elem.key, value: elem.value, documentId: elem.documentId, id: elem.id}).subscribe(
          (res) => { console.log('metadatos actualizados: ', res); },
          (err) => { console.log('An error ocurred while patching atributes: ', err); }
        );
      });
    }

    /* Update metadata multiple values */
    this.multipleMetadataList.forEach((elem) => {
      console.log("Vamos a guardar: ", elem);

      this.metapi.patchOrCreate({key: elem.key, value: elem.value, documentId: elem.documentId, id: elem.id}).subscribe(
        (res) => { console.log('Metadatos multiples actualizados'); },
        (err) => { console.log('An error ocurred while patching atributes: ', err); }
      );
    });


    this.showsaveChangeMessage();
  }

  getAuditInfo() {
    const filter = {
      where: { documentId: this.itemSelected.id}
    };

    this.auditapi.find(filter).subscribe(docAudit => {
      this.auditInfo = docAudit;
      for (let i = 0; i < this.auditInfo.length; i++) {
        const modifiedElement = this.auditInfo[i];
        const modificationDate = modifiedElement.date;
        const modificationFormattedDate = this.changeDateFormat(modificationDate);
        const modificationFormattedTime = this.changeTimeFormat(modificationDate);
        let modification = '';

        switch (modifiedElement.modified_elem) {
          case 'CREATED':
            modification += 'Fue subido el día '
                            + modificationFormattedDate
                            + ' a las ' + modificationFormattedTime;
            break;
          case 'isDeleted':
            if (modifiedElement.old_value == 'false') {
              modification += 'Fue borrado el día '
                              + modificationFormattedDate
                              + ' a las ' + modificationFormattedTime;
            } else {
              modification += 'Fue recuperado de la papelera el día '
                              + modificationFormattedDate
                              + ' a las ' + modificationFormattedTime;
            }

            break;
          case 'isFavourite':
            if (modifiedElement.old_value == 'false') {
              modification += 'Fue añadido a favoritos el día '
                              + modificationFormattedDate
                              + ' a las ' + modificationFormattedTime;
            } else {
              modification += 'Fue quitado de favoritos el día '
                              + modificationFormattedDate
                              + ' a las ' + modificationFormattedTime;
            }

            break;
          case 'description':
            modification += 'La descripción fue cambiada el día '
                            + modificationFormattedDate
                            + ' a las ' + modificationFormattedTime
                            + ' de \''
                            + modifiedElement.old_value + '\''
                            + ' a \''
                            + modifiedElement.new_value + '\'';
            break;

          case 'name':
            modification += 'El nombre fue cambiado el día '
                            + modificationFormattedDate
                            + ' a las ' + modificationFormattedTime
                            + ' de \''
                            + modifiedElement.old_value + '\''
                            + ' a \''
                            + modifiedElement.new_value + '\'';
            break;

          case 'metadatas':
            modification += 'Los metadatos fueron cambiados el día '
                            + modificationFormattedDate
                            + ' a las ' + modificationFormattedTime
                            + ' de \''
                            + modifiedElement.old_value + '\''
                            + ' a \''
                            + modifiedElement.new_value + '\'';
            break;

          default:
            modification += 'Sin modificación';
            break;
        }

        this.auditInfo[i].modified_elem = modification;
      }
      // console.log(this.auditInfo);
    }, err => { console.log('docCount ERROR: ', err); });
  }

  newMetadata(isMultiple: boolean) {
    if (isMultiple) {
      let doItOnce = true;

      this.multipleMetadataIDList.forEach(docID => {
        if (doItOnce) {
          this.multipleMetadataListIntersected = [...this.multipleMetadataListIntersected, {key: '', value: '', documentId: docID}];
          doItOnce = false;
        }

        this.multipleMetadataList = [...this.multipleMetadataList, {key: '', value: '', documentId: docID}];
        this.dataFiltered.find(i => i.id === docID).metadatas = [...this.dataFiltered.find(i => i.id === docID).metadatas, {key: '', value: '', documentId: docID}];
      });
    } else {
      this.metadataList = [...this.metadataList, {key: '', value: '', documentId: this.itemSelected.id}];
    }
  }

  updateMetadataKey(event: any, id: any, isMultiple: boolean) {
    if (isMultiple) {
      // Obtenemos el valor que se va a cambiar mostrado por pantalla
      const metadataToUpdate = this.multipleMetadataListIntersected[id];

      // Buscamos todas las copias de ese valor en la lista y cambiamos la key
      this.multipleMetadataList.forEach(metadata => {
        if (metadata.key === metadataToUpdate.key && metadata.value === metadataToUpdate.value) {
          //console.log('Metadata va a ser cambiada', metadata);
          metadata.key = event.target.value;
         // console.log('Metadata cambiada ', metadata);
        }
      });

      // Cambiamos la key en el metadato mostrado por pantalla
      this.multipleMetadataListIntersected[id].key = event.target.value;
    } else {
      this.metadataList[id].key = event.target.value;
    }
  }

  updateMetadataValue(event: any, id: any, isMultiple: boolean) {
    if (isMultiple) {
      const metadataToUpdate = this.multipleMetadataListIntersected[id];

      this.multipleMetadataList.forEach(metadata => {
        if (metadata.key === metadataToUpdate.key && metadata.value === metadataToUpdate.value) {
          console.log('Metadata va a ser cambiada', metadata);
          metadata.value = event.target.value;
          console.log('Metadata cambiada ', metadata);
        }
      });

      this.multipleMetadataListIntersected[id].value = event.target.value;
    } else {
      this.metadataList[id].value = event.target.value;
    }
  }

  // Opens confirmation dialog when you have not saved changes
  openConfirmationDialog(msg) {
    this.dialogService.openConfirmDialog(msg)
    .afterClosed().subscribe(res => {
      if (res) {
        // Accepted. Save changes
        this.saveChanges();
      }
    });
  }

  getDocDB(docID) {
    return new Promise((resolve, reject) => {
      try {
        this.docapi.findById(docID).subscribe({
          next: (doc) => { console.log('Se ha encontrado el documento que buscabas: ', doc); resolve(doc); },
          error: (err) => { reject(err); }
        });
      } catch (err) {
        console.log('An error ocurred at getDocDBDescription: ', err);
        reject(err);
      }
    });
  }

  getDocMetadataByID(docID) {
    return new Promise((resolve, reject) => {
      try {
        this.docapi.getMetadatas(docID).subscribe({
          next: (metadata) => {console.log('Se han encontrado los metadatos: ', metadata); resolve(metadata); },
          error: (err) => {reject(err); }
        }
          // (metadata) => {
          // console.log("Found metadata by getDocMetadataByID (promise): ", metadata);
          // resolve(metadata)
          // }
        );
      } catch (err) {
        console.log('An error ocurred at getDocDBName CATCH: ', err);
        reject(err);
      }
    });
  }

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
    this.http.get(`http://localhost:3000/api/Documents/${document.id}/download`,
    {responseType: 'arraybuffer', headers}).subscribe((data: any) => {
      const blob = new Blob([data], {type: document.type});
      const url = window.URL.createObjectURL(blob);

      saveAs(blob, document.name);
      window.open(url);
    });
  }

  move2PapperBin(doc: any) {
    /* update database */
    this.docapi.patchAttributes(doc.id, {isDeleted: true}).subscribe(
        () => {
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

  itemChecked(itemID: any) {
    const index = this.multipleMetadataIDList.findIndex(id => id === itemID);
    // const fichero = this.data.find(item => item.id === itemID);

    if (index === -1) {
      // Nuevo item pulsado
      this.multipleMetadataIDList.push(itemID);

      this.fillMultipleMetadataList(this.itemSelected, false);
    } else {
      this.multipleMetadataIDList.splice(index, 1);

      // Quitamos item de la lista
      let count = this.multipleMetadataIDList.length - 1;
      this.fillMultipleMetadataList(this.dataFiltered.find(item => item.id === this.multipleMetadataIDList[count]), true);

      while (count-- > 0) {
        this.fillMultipleMetadataList(this.dataFiltered.find(item => item.id === this.multipleMetadataIDList[count]), false);
      }
    }
  }

  private fillMultipleMetadataList(itemToIntersect: any, cond: boolean) {
    if (itemToIntersect === undefined) { return; }

    if (this.multipleMetadataIDList.length === 1 || cond) {
      this.multipleMetadataListIntersected = itemToIntersect.metadatas;
      this.multipleMetadataList = itemToIntersect.metadatas;
    } else {
      // Sacamos la intersección entre los dos conjuntos
      this.multipleMetadataList = [];

      this.multipleMetadataListIntersected = itemToIntersect.metadatas.filter(a => {
          const itemToAdd = this.multipleMetadataListIntersected.find(b => b.value === a.value && b.key === a.key);

          if (itemToAdd !== null && itemToAdd !== undefined) {
            this.multipleMetadataIDList.forEach(docID => {
              const fileInMultipleList = this.dataFiltered.find(doc => doc.id === docID);

              const metadataToAdd = fileInMultipleList.metadatas.find(metadata =>
                metadata.key === itemToAdd.key && metadata.value === itemToAdd.value
              );

              this.multipleMetadataList = [...this.multipleMetadataList, metadataToAdd];
            });


            return itemToAdd !== null || itemToAdd !== undefined;
          } else {
            return false;
          }
        }
      );
    }
  }

  showsaveChangeMessage() {
    document.getElementById('confirmChange').style.display = 'block';
    setTimeout(() => {
      document.getElementById('confirmChange').style.display = 'none';
    }, 2000);
  }

  addToFavorites(doc: any) {
    if (doc.isFavourite) {
      this.docapi.patchAttributes(doc.id, {isFavourite: false}).subscribe(
        () => {
          // this.itemSelected = {id: '', name: '', description: '', metadatas: []};
          this.getUserItemList();
        },
        (err) => {console.log('me cago en', err); }
    );
    } else {
      this.docapi.patchAttributes(doc.id, {isFavourite: true}).subscribe(
        () => {
          // this.itemSelected = {id: '', name: '', description: '', metadatas: []};
          this.getUserItemList();
        },
        (err) => { console.log('me cago en', err); }
    );
    }
  }

  deleteMetadata(id: number, isMultiple: boolean) {
    const msg = '¿Estás seguro de querer eliminar este metadato?';

    this.dialogService.openConfirmDialog(msg)
    .afterClosed().subscribe(res => {
      if (res) {
        // Accepted. Save changes
        if (isMultiple) {
          const metaToDelete = this.multipleMetadataListIntersected[id];

          this.dataFiltered.forEach(item => {
            // Si ese archivo está en la lista de seleccionados, cambiaremos sus metadatos para borrar el correspondiente
            if (this.multipleMetadataIDList.find(docID => item.id === docID) !== undefined) {
              let index = item.metadatas.findIndex(met => met.key === metaToDelete.key && met.value === metaToDelete.value);
              const metaId = item.metadatas[index].id;
              const docId = item.metadatas[index].documentId;

              // 1. Borramos de this.dataFiltered
              item.metadatas = [...item.metadatas.slice(0, index), ...item.metadatas.slice(index + 1)];

              // 2. Borramos de this.multipleMetadataList
              index = this.multipleMetadataList.findIndex(met => met.id === metaId); // Puede ser undefined si no se ha guardado en BBDD
              if (index === -1) { index = this.multipleMetadataList.findIndex(met => met.documentId === docId); } // Posibilidad de bugs!
              this.multipleMetadataList = [...this.multipleMetadataList.slice(0, index), ...this.multipleMetadataList.slice(index + 1)];

              // 3. Borramos de la base de datos
              this.docapi.destroyByIdMetadatas(docId, metaId).subscribe(
                (res) => { console.log('Deleted correctly'); },
                (err) => { console.log('Error while deleting: ', err); }
              );
            }
          });

          // 4. Borramos de this.multipleMetadataListIntersected
          this.multipleMetadataListIntersected = [...this.multipleMetadataListIntersected.slice(0, id),
                                                  ...this.multipleMetadataListIntersected.slice(id + 1)];

        } else {
          const metaId = this.metadataList[id].id;
          const docId = this.metadataList[id].documentId;

          this.metadataList = [...this.metadataList.slice(0, id), ...this.metadataList.slice(id + 1)];
          this.docapi.destroyByIdMetadatas(docId, metaId).subscribe(
            (res) => { console.log('Deleted correctly'); },
            (err) => { console.log('Error while deleting: ', err); }
          );
        }

        this.saveChanges();
        // this.showsaveChangeMessage();
      }
    });
  }

  // Formatea la fecha a dd/MM/yyyy
  changeDateFormat(date: Date): string {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }

  // Formatea la hora a h:mm:ss a
  changeTimeFormat(date: Date): string {
    return this.datepipe.transform(date, 'h:mm:ss a');
  }
}
