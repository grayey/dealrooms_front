import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunFinanceComponent } from './run-finance.component';

describe('RunFinanceComponent', () => {
  let component: RunFinanceComponent;
  let fixture: ComponentFixture<RunFinanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunFinanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
