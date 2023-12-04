import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCompraComponent } from './table-compra.component';

describe('TableProductoComponent', () => {
  let component: TableCompraComponent;
  let fixture: ComponentFixture<TableCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
