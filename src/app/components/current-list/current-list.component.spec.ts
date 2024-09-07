import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentListComponent } from './current-list.component';

describe('CurrentListComponent', () => {
  let component: CurrentListComponent;
  let fixture: ComponentFixture<CurrentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
