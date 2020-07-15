import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDealViewComponent } from './public-deal-view.component';

describe('PublicDealViewComponent', () => {
  let component: PublicDealViewComponent;
  let fixture: ComponentFixture<PublicDealViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicDealViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicDealViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
