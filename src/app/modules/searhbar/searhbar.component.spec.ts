import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearhbarComponent } from './searhbar.component';

describe('SearhbarComponent', () => {
  let component: SearhbarComponent;
  let fixture: ComponentFixture<SearhbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearhbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearhbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
