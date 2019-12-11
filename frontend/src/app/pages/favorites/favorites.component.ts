import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DocumentApi, ClientApi, MetadataApi } from '../../services/lb-api/services/index';
import { VentanaemergComponent} from 'src/app/pages/home/components/ventanaemerg/ventanaemerg.component';
import { ModalService } from '../../shared/_modal';
import { HttpClient, HttpEvent, HttpParams, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { saveAs } from '../../../../node_modules/file-saver/src/FileSaver.js';
import { HideAndSeekService } from 'src/app/services/hide-and-seek.service';
import { DialogService } from 'src/app/shared/dialog.service';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  @ViewChild('textarea', {static: false}) textarea: ElementRef;
  @ViewChild('nameInput', {static: false}) nameInput: ElementRef;

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

  //Variables paginación
  anterior: any;
  siguiente: any;
  primero: any;
  ultimo: any;
  currentPos: number = 0;
  totalFiles: number = 0;
  currentPage: number;
  totalPages: number;
  perPage: number = 5;
  visibleDocs: number = this.perPage;

  constructor(private clientapi: ClientApi, private docapi: DocumentApi,
    public dialog: MatDialog, private http: HttpClient, private metapi: MetadataApi,
    private modalService: ModalService, public hideAndSeekService: HideAndSeekService,
    private dialogService: DialogService) {
      this.data = [];
      this.dataFiltered = [];
      this.metadata = [];
      this.tempMetadata = [];
      this.hoverIndex = -1;
      this.dataOrder = '';

      this.itemSelected = {id: '', name: '', description: '', metadatas: []};
      this.textAreaText = this.itemSelected.description;

      document.addEventListener('click', (event) => {
      // Oculta el panel de edición de datos al pulsar fuera del mismo panel, listado de fichero o buscador
      this.editionPanelVisibility(event);
      });
    }

  ngOnInit() {
    this.anterior = document.getElementById("anterior");
    this.siguiente = document.getElementById("siguiente");
    this.primero = document.getElementById("firstPage");
    this.ultimo = document.getElementById("lastPage");

    this.getUserItemList();
  }

  editionPanelVisibility(event) {
    if(document.getElementById('searchbarContainer') != null && document.getElementById('itemsTable') != null
    && document.getElementById('dataEditionPanel') != null){
      const searchbarClicked = document.getElementById('searchbarContainer').contains((event.target as HTMLElement));
      const filesClicked = document.getElementById('itemsTable').contains((event.target as HTMLElement));
      const editionPanelClicked = document.getElementById('dataEditionPanel').contains((event.target as HTMLElement));

      if(!searchbarClicked && !filesClicked && !editionPanelClicked && document.getElementById('dataEditionPanel').style.display === 'block') {
        document.getElementsByClassName('table')[0].setAttribute('style', 'width: 100%; float: left;');
        document.getElementById('dataEditionPanel').style.display = 'none';
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
      limit: this.perPage,
      skip: this.currentPos,
      order: this.dataOrder,
      where: { clientId: userId, isDeleted: false, isFavourite: true},
      include: 'metadatas',
    };

    this.docapi.find(filter).subscribe((docList) => {
      this.data = docList;
      this.dataFiltered = this.data;
      // console.log('ngOnInit findById data: ', docList);
      this.updatePaginationInfo(docList.length);
    }, (error) => {
      console.log('Wtf dude', error);
    });
  }

  //Updates pagination pages text on clicks
  updatePaginationInfo(docsView:number){
    this.anterior.setAttribute("disabled","disabled");
    this.siguiente.setAttribute("disabled","disabled");
    this.primero.setAttribute("disabled","disabled");
    this.ultimo.setAttribute("disabled","disabled");

    //Guarda los documentos que están visibles
    this.visibleDocs = docsView;

    //Comprueba si ya no hay ficheros en la tabla
    if(this.visibleDocs == 0){
      //Si ya no hay más páginas, quita la paginación
      if(this.anterior.hasAttribute("disabled")){
        document.getElementById("paginationContainer").style.display = "none";
        console.log("No hay documentos a mostrar!");
        if(this.totalPages > 1){
          this.pagAnterior();
        }
      }else{
        //Si quedan páginas, vuelve a la anterior
        this.pagAnterior();
      }
      return;
    }

    //Obtenemos el número total de documentos disponibles y actualizamos los datos de paginación
    this.docapi.count({isDeleted: false, isFavourite: true}).subscribe(docCount => {
      this.totalFiles = docCount.count;
      //this.updatePaginationInfo();

      //Cálculo de página actual y total de páginas
      this.currentPage = Math.ceil(this.currentPos/this.perPage)+1;
      this.totalPages = Math.ceil(this.totalFiles/this.perPage);

      if(this.currentPos > 0){
        this.anterior.removeAttribute("disabled");
        this.primero.removeAttribute("disabled");
      }
		  if(this.currentPos + this.perPage < this.totalFiles){
        this.siguiente.removeAttribute("disabled");
        this.ultimo.removeAttribute("disabled");
      } 

      if(this.totalPages > 1){
        document.getElementById("currentPage").innerHTML = ""+this.currentPage;
        document.getElementById("totalPages").innerHTML = ""+this.totalPages;
        document.getElementById("paginationContainer").style.display = "block";
      }
    }, err => { console.log('docCount ERROR: ', err); });
    //console.log(this.totalFiles +" " +this.totalPages +" " +this.currentPos);

    if(this.anterior.hasAttribute("disabled") 
      && this.siguiente.hasAttribute("disabled") 
      && this.primero.hasAttribute("disabled") 
      && this.ultimo.hasAttribute("disabled")){
        document.getElementById("paginationContainer").style.display = "none";
    }
  }

  //Botón paginación de ir a la priemra página
  firstPage(){
    this.currentPos = 0;
    this.getUserItemList();
  }

  //Botón paginación de ir a la última página
  lastPage(){
    this.currentPos = (this.perPage*this.totalPages)-this.perPage;
    this.getUserItemList();
  }

  //Botón paginación de ir a la página anterior
  pagAnterior() {
    this.currentPos -= this.perPage;
    this.getUserItemList();
  }
  
  //Botón paginación de ir a la siguiente página
  pagSiguiente() {
    this.currentPos += this.perPage;
    this.getUserItemList();	
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
    const isFavourite = (event.target as HTMLElement).id == 'favouriteButtonIcon';
    // Reducir el ancho de la tabla de ficheros si no se ha pulsado ningún icono
    if (!isDownload && !isShare && !isDelete && !isFavourite) {
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

  Favourite(doc: any) {
    if (doc.isFavourite){
      this.docapi.patchAttributes(doc.id, {isFavourite: false}).subscribe(
        (no) => {
          this.getUserItemList();
        },
        (err) => {console.log('me cago en', err); }
    );
    } else {
      this.docapi.patchAttributes(doc.id, {isFavourite: true}).subscribe(
        (no) => {
          this.getUserItemList();
        },
        (err) => {console.log('me cago en', err); }

    );
    }
  }

  deleteMetadata(id: number) {
    const msg = '¿Estás seguro de querer eliminar este metadato?';

    this.dialogService.openConfirmDialog(msg)
    .afterClosed().subscribe(res => {
      if (res) {
        // Accepted. Save changes
        let metaId = this.tempMetadata[id].id;
        let docId = this.tempMetadata[id].documentId;

        this.tempMetadata = [...this.tempMetadata.slice(0, id), ...this.tempMetadata.slice(id + 1)];        
        this.docapi.destroyByIdMetadatas(docId, metaId).subscribe(
          (res) => { console.log("Deleted correctly"); },
          (err) => { console.log("Error while deleting: ", err); }
          )
        this.saveChanges();
        // this.showsaveChangeMessage();
      }
    });
  }
}
