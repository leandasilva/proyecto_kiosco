import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarUserComponent } from './sidebaruser.component';

describe('SidebarComponent', () => {
  let component: SidebarUserComponent;
  let fixture: ComponentFixture<SidebarUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
