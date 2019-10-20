import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaemergComponent } from './ventanaemerg.component';

describe('VentanaemergComponent', () => {
  let component: VentanaemergComponent;
  let fixture: ComponentFixture<VentanaemergComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaemergComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaemergComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
