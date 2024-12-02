import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMedicinalplantComponent } from './manage-medicinalplant.component';

describe('ManageMedicinalplantComponent', () => {
  let component: ManageMedicinalplantComponent;
  let fixture: ComponentFixture<ManageMedicinalplantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMedicinalplantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMedicinalplantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
