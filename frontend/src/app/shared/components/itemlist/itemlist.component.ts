import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.css']
})
export class ItemlistComponent implements OnInit {

  @Input() dataFiltered: any;

  dataOrder: any;

  constructor() { }

  ngOnInit() {
  }
/* 
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

  deleteSortIcons() {
    if (document.getElementById('sortUpIcon') != null) {
      document.getElementById('sortUpIcon').remove();
    }

    if (document.getElementById('sortDownIcon') != null) {
      document.getElementById('sortDownIcon').remove();
    }
  }
   */
}
