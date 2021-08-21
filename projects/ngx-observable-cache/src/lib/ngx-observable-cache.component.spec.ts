import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxObservableCacheComponent } from './ngx-observable-cache.component';

describe('NgxObservableCacheComponent', () => {
  let component: NgxObservableCacheComponent;
  let fixture: ComponentFixture<NgxObservableCacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxObservableCacheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxObservableCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
