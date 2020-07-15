import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealRunnersComponent } from './deal-runners.component';

describe('DealRunnersComponent', () => {
  let component: DealRunnersComponent;
  let fixture: ComponentFixture<DealRunnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealRunnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealRunnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
