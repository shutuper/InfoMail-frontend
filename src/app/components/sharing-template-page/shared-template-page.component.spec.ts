import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SharedTemplatePageComponent} from './shared-template-page.component';

describe('SharingTemplatePageComponent', () => {
  let component: SharedTemplatePageComponent;
  let fixture: ComponentFixture<SharedTemplatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedTemplatePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
