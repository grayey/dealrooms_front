import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealOwnersComponent } from './deal-owners.component';

describe('DealOwnersComponent', () => {
  let component: DealOwnersComponent;
  let fixture: ComponentFixture<DealOwnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealOwnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
