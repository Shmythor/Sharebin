import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @Output() searchToEmit = new EventEmitter<string>();
  @Output() filterToEmit = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {

  }

  filterBy(filter: string) {
    this.filterToEmit.emit(filter);
  }

  search(event: any) {
    this.searchToEmit.emit(event.target.value);
  }

}
