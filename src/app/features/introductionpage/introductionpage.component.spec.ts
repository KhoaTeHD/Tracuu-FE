import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionpageComponent } from './introductionpage.component';

describe('IntroductionpageComponent', () => {
  let component: IntroductionpageComponent;
  let fixture: ComponentFixture<IntroductionpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroductionpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroductionpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
