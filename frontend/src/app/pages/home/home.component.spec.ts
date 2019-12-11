import { TestBed, async, ComponentFixture, inject, tick, fakeAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { ShareURLPopupComponent } from './components/share-urlpopup/share-urlpopup.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { VentanaemergComponent } from './components/ventanaemerg/ventanaemerg.component';


describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let de: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ 
                HomeComponent, 
                SearchbarComponent,
                ShareURLPopupComponent,
                UploadFilesComponent,
                VentanaemergComponent
             ],
        })
        .compileComponents(); // compile template and css
    });

    
    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        fixture.detectChanges();
    })

    it('should create', () => {
        component.getAuditInfo();
        for (let i = 0; i < component.auditInfo.length; i++) {
            component.auditInfo[i].modified_elem
            expect(component.auditInfo[i].modified_elem).toBeTruthy();
        }
    })
})


