import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @Output() searchToEmit = new EventEmitter<string>();
  @Output() filterToEmit = new EventEmitter<string>();


  nameActivated = true;
  descriptionActivated = false;
  metadataActivated = false;

  constructor() { }

  ngOnInit() {

  }

  filterBy(filter: string) {
    switch (filter) {
      case 'name': this.nameActivated = !this.nameActivated; break;
      case 'description': this.descriptionActivated = !this.descriptionActivated; break;
      case 'metadata': this.metadataActivated = !this.metadataActivated; break;
    }
    this.filterToEmit.emit(filter);
  }

  search(event: any) {
    this.searchToEmit.emit(event.target.value);
  }

}
