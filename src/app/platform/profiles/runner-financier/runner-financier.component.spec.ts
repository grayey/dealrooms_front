import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnerFinancierComponent } from './runner-financier.component';

describe('RunnerFinancierComponent', () => {
  let component: RunnerFinancierComponent;
  let fixture: ComponentFixture<RunnerFinancierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunnerFinancierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnerFinancierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
