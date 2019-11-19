import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaalertComponent } from './ventanaalert.component';

describe('VentanaalertComponent', () => {
  let component: VentanaalertComponent;
  let fixture: ComponentFixture<VentanaalertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaalertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
