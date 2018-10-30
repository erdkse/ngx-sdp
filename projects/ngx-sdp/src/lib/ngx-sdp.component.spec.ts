import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  NgxSdpComponent,
  MONTH_LABEL,
  DEFAULT_LABEL
} from './ngx-sdp.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('NgxSdpComponent', () => {
  let component: NgxSdpComponent;
  let fixture: ComponentFixture<NgxSdpComponent>;
  let daySelection;
  let monthSelection;
  let yearSelection;
  const today: Date = new Date(
    Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0,
      0
    )
  );
  const givenDate: Date = new Date(Date.UTC(1990, 7, 1, 0, 0, 0, 0));
  const monthLabel = MONTH_LABEL;
  const defaultLabel = DEFAULT_LABEL;

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

  it('should select today on default', () => {
    expect([
      today.getFullYear(),
      monthLabel[component.language][today.getMonth()],
      today.getDate()
    ]).toEqual([
      +yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      +daySelection.options[daySelection.selectedIndex].innerHTML
    ]);

    // expect([
    //   defaultLabel.en.year,
    //   defaultLabel.en.month,
    //   defaultLabel.en.day
    // ]).toEqual([
    //   yearSelection.options[yearSelection.selectedIndex].innerHTML,
    //   monthSelection.options[monthSelection.selectedIndex].innerHTML,
    //   daySelection.options[daySelection.selectedIndex].innerHTML
    // ]);
  });

  it('should select given date', () => {
    component.writeValue(givenDate);

    expect([1990, monthLabel[component.language][7], 1]).toEqual([
      +yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      +daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should select today if given date is null', () => {
    component.writeValue(null);

    expect([
      today.getFullYear(),
      monthLabel[component.language][today.getMonth()],
      today.getDate()
    ]).toEqual([
      +yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      +daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should throw error if given date is not a date object', () => {
    expect(() => {
      component.writeValue('I am not a date object');
    }).toThrow();
  });

  it('should select correct date when day is changed', () => {
    const dayToSelect = 5;

    component.dateForm.controls.day.patchValue(dayToSelect);

    expect([
      today.getFullYear(),
      monthLabel[component.language][today.getMonth()],
      dayToSelect
    ]).toEqual([
      +yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      +daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should select correct date when month is changed', () => {
    const monthToSelect = 5;

    component.dateForm.controls.month.patchValue(monthToSelect);

    expect([
      today.getFullYear(),
      monthLabel[component.language][monthToSelect],
      today.getDate()
    ]).toEqual([
      +yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      +daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should select correct date when year is changed', () => {
    const yearToSelect = 2000;

    component.dateForm.controls.year.patchValue(yearToSelect);

    expect([
      yearToSelect,
      monthLabel[component.language][today.getMonth()],
      today.getDate()
    ]).toEqual([
      +yearSelection.options[yearSelection.selectedIndex].innerHTML,
      monthSelection.options[monthSelection.selectedIndex].innerHTML,
      +daySelection.options[daySelection.selectedIndex].innerHTML
    ]);
  });

  it('should count days of a month truly', () => {
    component.writeValue(new Date(Date.UTC(1990, 1, 1, 0, 0, 0, 0)));
    // Change detecton needs to run this behaviour should change
    fixture.detectChanges();
    expect(daySelection.options.length).toBe(29);
  });

  it('should display zero days if month is not selected', () => {
    component.writeValue(new Date(Date.UTC(1990, 1, 1, 0, 0, 0, 0)));
    component.dateForm.controls.month.patchValue(null);
    // Change detecton needs to run this behaviour should change
    fixture.detectChanges();
    expect(daySelection.options.length).toBe(1);
  });

  it('should disable form when state is disabled', () => {
    component.setDisabledState(true);
    expect(
      daySelection.disabled && monthSelection.disabled && yearSelection.disabled
    ).toBeTruthy();
  });

  it('should enable form when state is enabled', () => {
    component.setDisabledState(false);
    expect(
      !daySelection.disabled &&
        !monthSelection.disabled &&
        !yearSelection.disabled
    ).toBeTruthy();
  });

  it('should display months in english on default', () => {
    component.writeValue(givenDate);

    expect(monthLabel[component.language][givenDate.getMonth()]).toEqual(
      'August'
    );
  });

  it('should change language', () => {
    component.writeValue(givenDate);
    component.language = 'tr';

    expect(monthLabel[component.language][givenDate.getMonth()]).toEqual(
      'Ağustos'
    );
  });

  // it('should limit maximum year if maxDate property is set', () => {
  //   component.maxDate = new Date(Date.UTC(2050, 1, 1, 0, 0, 0, 0));
  //   fixture.detectChanges();
  //   expect(+yearSelection.options[1].innerHTML).toBe(2050);
  // });

  // it('should limit minimum year if minDate property is set', () => {
  //   component.minDate = new Date(Date.UTC(1950, 1, 1, 0, 0, 0, 0));
  //   fixture.detectChanges();
  //   expect(
  //     +yearSelection.options[yearSelection.options.length - 1].innerHTML
  //   ).toBe(1950);
  // });
});
