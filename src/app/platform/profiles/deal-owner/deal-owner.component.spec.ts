import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealOwnerComponent } from './deal-owner.component';

describe('DealOwnerComponent', () => {
  let component: DealOwnerComponent;
  let fixture: ComponentFixture<DealOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
