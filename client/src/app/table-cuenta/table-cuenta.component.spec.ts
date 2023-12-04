import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCuentaComponent } from './table-cuenta.component';

describe('TableCuentaComponent', () => {
  let component: TableCuentaComponent;
  let fixture: ComponentFixture<TableCuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
