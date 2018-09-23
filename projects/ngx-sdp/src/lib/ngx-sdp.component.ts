import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-sdp',
  templateUrl: './ngx-sdp.component.html',
  styleUrls: ['./ngx-sdp.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxSdpComponent),
      multi: true
    }
  ]
})
export class NgxSdpComponent   implements OnInit, ControlValueAccessor {
  public days = [];
  public months = [];
  public years = [];
  @Input()
  minDate: Date;
  @Input()
  showError: boolean = false;
  @Input()
  maxDate: Date;
  public minYear: number = 1900;
  public maxYear = new Date().getFullYear();
  public monthLabel = MONTH_LABEL;
  public dateForm: FormGroup;
  public today: Date = new Date();
  public propagateChange = (_: any) => {};

  constructor() {}

  ngOnInit() {
    this.minYear = this.minDate ? this.minDate.getFullYear() : this.minYear;
    this.maxYear = this.maxDate ? this.maxDate.getFullYear() : this.maxYear;

    for (let year = this.minYear; year <= this.maxYear; year++) {
      this.years.unshift(year);
    }
    for (let month = 0; month < 12; month++) {
      this.months.push(month);
    }

    this.dateForm = new FormGroup({
      day: new FormControl(null, Validators.required),
      month: new FormControl(null, Validators.required),
      year: new FormControl(null, Validators.required)
    });

    this.dateForm.valueChanges.subscribe(value => {
      if (
        value &&
        !(value.day === 0 && value.month === 0 && value.year === 0)
      ) {
        this.days = [
          ...Array.from(
            { length: this.daysInMonth(value.month, value.year) },
            (v, k) => k + 1
          )
        ];

        this.propagateChange(
          new Date(
            Date.UTC(
              value.year,
              value.month,
              this.days.findIndex(e => e === value.day) > -1 ? value.day : 1,
              0,
              0,
              0,
              0
            )
          )
        );
      } else {
        this.propagateChange(null);
      }
    });
  }

  writeValue(date: Date): void {
    if (date instanceof Date) {
      this.dateForm.patchValue({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
      });
    } else if (date === null || date === undefined) {
      this.dateForm.patchValue({
        year: this.maxDate
          ? this.maxDate.getFullYear()
          : new Date().getFullYear(),
        month: this.maxDate ? this.maxDate.getMonth() : new Date().getMonth(),
        day: this.maxDate ? this.maxDate.getDate() : new Date().getDate()
      });
    } else {
      throw new Error('Input variable is not Date object');
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.dateForm.disable();
    } else {
      this.dateForm.enable();
    }
  }

  createDateAsUTC(date) {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
  }

  daysInMonth(month, year) {
    return new Date(Date.UTC(year, month + 1, 0, 0, 0, 0, 0)).getDate();
  }
}

export const MONTH_LABEL = {
  tr: [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık'
  ],
  en: [
    'January',
    'Fabrurary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Agust',
    'September',
    'October',
    'Novermber',
    'December'
  ]
};
