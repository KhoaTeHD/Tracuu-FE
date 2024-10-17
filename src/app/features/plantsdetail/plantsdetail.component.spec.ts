import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantsdetailComponent } from './plantsdetail.component';

describe('PlantsdetailComponent', () => {
  let component: PlantsdetailComponent;
  let fixture: ComponentFixture<PlantsdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantsdetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
