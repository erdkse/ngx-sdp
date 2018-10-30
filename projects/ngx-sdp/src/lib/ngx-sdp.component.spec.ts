import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  NgxSdpComponent,
  MONTH_LABEL,
  DEFAULT_LABEL,
  ISelectionDate
} from './ngx-sdp.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('NgxSdpComponent', () => {
  let component: NgxSdpComponent;
  let fixture: ComponentFixture<NgxSdpComponent>;
  let daySelection;
  let monthSelection;
  let yearSelection;
  const today: ISelectionDate = {
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };
  const givenDate: ISelectionDate = { day: 1, month: 7, year: 1990 };
  const monthLabel = MONTH_LABEL;
  const defaultLabel = DEFAULT_LABEL;
  const simpleChanges: SimpleChanges = {
    maxDate: new SimpleChange(null, { day: 1, month: 1, year: 2050 }, false),
    minDate: new SimpleChange(null, { day: 1, month: 1, year: 1950 }, false)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxSdpComponent],
      imports: [CommonModule, ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSdpComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();

    daySelection = fixture.debugElement.nativeElement.querySelector(
      '.form-control.day'
    );

    monthSelection = fixture.debugElement.nativeElement.querySelector(
      '.form-control.month'
    );

    yearSelection = fixture.debugElement.nativeElement.querySelector(
      '.form-control.year'
    );
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should select nothing on default', () => {
    expect([
      defaultLabel.en.year,
      defaultLabel.en.month,
      defaultLabel.en.day
    ]).toEqual([
      yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should select given date', () => {
    component.writeValue(givenDate);

    expect([1990, monthLabel[component.language][7], 1]).toEqual([
      +yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      +daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should select nothing if given date is null', () => {
    component.writeValue(null);

    expect([
      defaultLabel.en.year,
      defaultLabel.en.month,
      defaultLabel.en.day
    ]).toEqual([
      yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should throw error if given date is not a selection date interface', () => {
    expect(() => {
      component.writeValue('I am not a date object');
    }).toThrow();
  });

  it('should select correct date when day is changed', () => {
    component.writeValue(today);
    const dayToSelect = 5;
    component.dayChanged(dayToSelect);

    expect([
      today.year,
      monthLabel[component.language][today.month],
      dayToSelect
    ]).toEqual([
      +yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      +daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should select correct date when month is changed', () => {
    component.writeValue(today);
    const monthToSelect = 5;
    component.monthChanged(monthToSelect);

    expect([
      today.year,
      monthLabel[component.language][monthToSelect],
      today.day
    ]).toEqual([
      +yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      +daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should select correct date when year is changed', () => {
    component.writeValue(today);
    const yearToSelect = 2000;
    component.yearChanged(yearToSelect);

    expect([
      yearToSelect,
      monthLabel[component.language][today.month],
      today.day
    ]).toEqual([
      +yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      +daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should count days of a month truly', () => {
    component.writeValue({ day: 1, month: 1, year: 1990 });
    expect(daySelection.options.length).toBe(29);
  });

  it('should display zero days if month is not selected', () => {
    component.writeValue(givenDate);
    component.monthChanged(null);
    expect(daySelection.options.length).toBe(1);
  });

  it('should display zero days if year is not selected', () => {
    component.writeValue(givenDate);
    component.yearChanged(null);
    expect(daySelection.options.length).toBe(1);
  });

  it('should disable fields when state is disabled', () => {
    component.setDisabledState(true);
    expect(
      daySelection.disabled && monthSelection.disabled && yearSelection.disabled
    ).toBeTruthy();
  });

  it('should enable fields when state is enabled', () => {
    component.setDisabledState(false);
    expect(
      !daySelection.disabled &&
        !monthSelection.disabled &&
        !yearSelection.disabled
    ).toBeTruthy();
  });

  it('should display months in english on default', () => {
    component.writeValue(givenDate);

    expect(monthLabel[component.language][givenDate.month]).toEqual('August');
  });

  it('should change language', () => {
    component.writeValue(givenDate);
    component.language = 'tr';

    expect(monthLabel[component.language][givenDate.month]).toEqual('Ağustos');
  });

  it('should set maximum year on init', () => {
    expect(component.maxYear).toBe(today.year);
  });

  it('should set minimum year on init', () => {
    expect(component.minYear).toBe(1900);
  });

  it('should limit maximum year on init', () => {
    expect(+yearSelection.options[1].innerHTML).toBe(component.maxYear);
  });

  it('should limit minimum year on init', () => {
    expect(
      +yearSelection.options[yearSelection.options.length - 1].innerHTML
    ).toBe(component.minYear);
  });

  it('should limit maximum year if maxDate property changes', () => {
    component.ngOnChanges(simpleChanges);
    expect(+yearSelection.options[1].innerHTML).toBe(2050);
  });

  it('should limit minimum year if minDate property changes', () => {
    component.ngOnChanges(simpleChanges);
    expect(
      +yearSelection.options[yearSelection.options.length - 1].innerHTML
    ).toBe(1950);
  });
});
