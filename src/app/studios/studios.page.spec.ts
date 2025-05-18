import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudiosPage } from './studios.page';

describe('StudiosPage', () => {
  let component: StudiosPage;
  let fixture: ComponentFixture<StudiosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
