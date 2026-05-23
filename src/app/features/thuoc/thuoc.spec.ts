import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thuoc } from './thuoc';

describe('Thuoc', () => {
  let component: Thuoc;
  let fixture: ComponentFixture<Thuoc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Thuoc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Thuoc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
