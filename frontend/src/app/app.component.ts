import { Component } from '@angular/core';
import { LoopBackConfig } from './services/lb-api/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sharebin';
  constructor() {
    LoopBackConfig.setBaseURL('http://localhost:3000');
    LoopBackConfig.setApiVersion('api');
  }
}
