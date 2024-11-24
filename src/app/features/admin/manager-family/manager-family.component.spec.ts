import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerFamilyComponent } from './manager-family.component';

describe('ManagerFamilyComponent', () => {
  let component: ManagerFamilyComponent;
  let fixture: ComponentFixture<ManagerFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerFamilyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
