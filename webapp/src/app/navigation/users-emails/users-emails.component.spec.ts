import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersEmailsComponent } from './users-emails.component';

describe('UsersEmailsComponent', () => {
  let component: UsersEmailsComponent;
  let fixture: ComponentFixture<UsersEmailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersEmailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
