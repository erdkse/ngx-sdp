import {
  Component,
  OnInit,
  forwardRef,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxSdpComponent
  implements OnInit, OnChanges, ControlValueAccessor {
  public isDisabled: boolean = false;
  public days = [];
  public months = [];
  public years = [];
  @Input()
  public showError: boolean = false;
  @Input()
  public minDate: ISelectionDate;
  @Input()
  public maxDate: ISelectionDate;
  @Input()
  public language: string = 'en';
  public minYear: number = 1900;
  public maxYear = new Date().getFullYear();
  public monthLabel = MONTH_LABEL;
  public defaultLabel = DEFAULT_LABEL;
  public date: ISelectionDate = { day: null, month: null, year: null };
  public today: Date = new Date();
  public propagateChange = (_: any) => {};

  constructor(private changeDetectionRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.maxDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate()
    };
    this.loadYears(this.minDate, this.maxDate);
    this.loadMonths();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.minDate && !changes.minDate.firstChange) {
      this.loadYears(changes.minDate.currentValue, this.maxDate);
      this.loadMonths();
    }
    if (changes.maxDate && !changes.maxDate.firstChange) {
      this.loadYears(this.minDate, changes.maxDate.currentValue);
      this.loadMonths();
    }
  }

  dayChanged(day) {
    this.date.day = day === null || day === 'null' ? null : +day;
    this.changeDetectionRef.detectChanges();
    this.informValueChange();
  }

  monthChanged(month) {
    this.date.month = month === null || month === 'null' ? null : +month;
    this.loadDays(this.date.month, this.date.year);
    this.informValueChange();
  }

  yearChanged(year) {
    this.date.year = year === null || year === 'null' ? null : +year;
    this.loadDays(this.date.month, this.date.year);
    this.loadMonths();
    this.informValueChange();
  }

  loadYears(minDate, maxDate) {
    this.minYear = minDate ? minDate.year : this.minYear;
    this.maxYear = maxDate ? maxDate.year : this.maxYear;
    this.years = [];
    for (let year = this.minYear; year <= this.maxYear; year++) {
      this.years.unshift(year);
    }
    this.changeDetectionRef.detectChanges();
  }

  loadMonths() {
    this.months = [...Array.from({ length: 12 }, (v, k) => k)].filter(month => {
      let state = true;

      if (this.date && this.date.year) {
        if (this.isInstanceOfSelectionDateInterface(this.maxDate)) {
          state =
            state &&
            (this.date.year === this.maxDate.year
              ? month <= this.maxDate.month
              : true);
        }

        if (this.isInstanceOfSelectionDateInterface(this.minDate)) {
          state =
            state &&
            (this.date.year === this.minDate.year
              ? month >= this.minDate.month
              : true);
        }
      }

      return state;
    });
    this.date.month =
      this.months.findIndex(e => e === this.date.month) > -1
        ? this.date.month
        : null;
    this.changeDetectionRef.detectChanges();
  }

  loadDays(month, year) {
    this.days = [
      ...Array.from({ length: this.daysInMonth(month, year) }, (v, k) => k + 1)
    ].filter(day => {
      let state = true;

      if (this.date && this.date.year && this.date.month) {
        if (this.isInstanceOfSelectionDateInterface(this.maxDate)) {
          state =
            state &&
            this.isDateEarlier(
              {
                year: this.date.year,
                month: this.date.month,
                day: day
              },
              this.maxDate
            );
        }

        if (this.isInstanceOfSelectionDateInterface(this.minDate)) {
          state =
            state &&
            this.isDateEarlier(this.minDate, {
              year: this.date.year,
              month: this.date.month,
              day: day
            });
        }
      }

      return state;
    });
    this.date.day =
      this.days.findIndex(e => e === this.date.day) > -1 ? this.date.day : null;
    this.changeDetectionRef.detectChanges();
  }

  informValueChange() {
    if (this.isInstanceOfSelectionDateInterface(this.date)) {
      this.propagateChange(this.date);
    } else {
      this.propagateChange(null);
    }
  }

  writeValue(date): void {
    if (date && !this.isInstanceOfSelectionDateInterface(date)) {
      throw new Error('Input variable is not SelectionDate object');
    }

    if (this.isInstanceOfSelectionDateInterface(date)) {
      this.date = {
        year: date.year,
        month: date.month,
        day: date.day
      };
      this.loadYears(this.minDate, this.maxDate);
      this.loadMonths();
      this.loadDays(this.date.month, this.date.year);
    }

    if (!date) {
      this.date = {
        year: null,
        month: null,
        day: null
      };
    }
  }

  isDefined(value): boolean {
    return !(value === null || value === undefined || value === NaN);
  }

  isInstanceOfSelectionDateInterface(value): boolean {
    if (value && typeof value === 'object') {
      return (
        value.hasOwnProperty('year') &&
        (value.year === null || Number.isInteger(value.year)) &&
        value.hasOwnProperty('month') &&
        (value.month === null || Number.isInteger(value.month)) &&
        value.hasOwnProperty('day') &&
        (value.day === null || Number.isInteger(value.day))
      );
    }
    return false;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.changeDetectionRef.detectChanges();
  }

  daysInMonth(month: number, year: number) {
    if (!this.isDefined(month) || !this.isDefined(year)) {
      return 0;
    }
    return new Date(Date.UTC(year, month + 1, 0, 0, 0, 0, 0)).getDate();
  }

  isDateEarlier(date: ISelectionDate, dateToCompare: ISelectionDate) {
    if (!date || !dateToCompare) {
      throw new Error('You Must provide two dates');
    }

    return (
      new Date(date.year, date.month, date.day, 0, 0, 0, 0).getTime() <=
      new Date(
        dateToCompare.year,
        dateToCompare.month,
        dateToCompare.day,
        0,
        0,
        0,
        0
      ).getTime()
    );
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
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
};

export const DEFAULT_LABEL = {
  tr: {
    day: 'Gün seçiniz',
    month: 'Ay seçiniz',
    year: 'Yıl seçiniz'
  },
  en: {
    day: 'Pick a day',
    month: 'Pick a month',
    year: 'Pick a year'
  }
};

export interface ISelectionDate {
  day: number;
  month: number;
  year: number;
}
