import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareURLPopupComponent } from './share-urlpopup.component';

describe('ShareURLPopupComponent', () => {
  let component: ShareURLPopupComponent;
  let fixture: ComponentFixture<ShareURLPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareURLPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareURLPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
