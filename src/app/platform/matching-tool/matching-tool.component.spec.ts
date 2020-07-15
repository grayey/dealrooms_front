import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingToolComponent } from './matching-tool.component';

describe('MatchingToolComponent', () => {
  let component: MatchingToolComponent;
  let fixture: ComponentFixture<MatchingToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchingToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
