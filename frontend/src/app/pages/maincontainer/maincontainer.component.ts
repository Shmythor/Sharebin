import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maincontainer',
  templateUrl: './maincontainer.component.html',
  styleUrls: ['./maincontainer.component.css']
})
export class MaincontainerComponent implements OnInit {
  componentToLoad = 'home';
  sub: any;

  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.router
      .data
      .subscribe(v => {
        this.componentToLoad = v.load;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
