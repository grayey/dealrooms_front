import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicOpportunitiesComponent } from './public-opportunities.component';

describe('PublicOpportunitiesComponent', () => {
  let component: PublicOpportunitiesComponent;
  let fixture: ComponentFixture<PublicOpportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
