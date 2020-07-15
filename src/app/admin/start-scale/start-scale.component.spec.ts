import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartScaleComponent } from './start-scale.component';

describe('StartScaleComponent', () => {
  let component: StartScaleComponent;
  let fixture: ComponentFixture<StartScaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartScaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
