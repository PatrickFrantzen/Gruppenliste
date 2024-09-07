import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseListDialogComponent } from './choose-list-dialog.component';

describe('ChooseListDialogComponent', () => {
  let component: ChooseListDialogComponent;
  let fixture: ComponentFixture<ChooseListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseListDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
