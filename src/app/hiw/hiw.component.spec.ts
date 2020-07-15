import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiwComponent } from './hiw.component';

describe('HiwComponent', () => {
  let component: HiwComponent;
  let fixture: ComponentFixture<HiwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
