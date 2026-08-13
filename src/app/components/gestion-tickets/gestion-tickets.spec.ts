import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTickets } from './gestion-tickets';

describe('GestionTickets', () => {
  let component: GestionTickets;
  let fixture: ComponentFixture<GestionTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTickets],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionTickets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
