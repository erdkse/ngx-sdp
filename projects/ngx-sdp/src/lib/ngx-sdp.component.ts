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
    this.loadYears(this.minDate, this.maxDate);
    this.loadMonths();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.minDate && !changes.minDate.firstChange) {
      this.loadYears(changes.minDate.currentValue, this.maxDate);
    }
    if (changes.maxDate && !changes.maxDate.firstChange) {
      this.loadYears(this.minDate, changes.maxDate.currentValue);
    }
  }

  dayChanged(day) {
    this.date.day = day == null ? null : +day;
    this.changeDetectionRef.detectChanges();
    this.informValueChange();
  }

  monthChanged(month) {
    this.date.month = month == null ? null : +month;
    this.loadDays(this.date.month, this.date.year);
    this.informValueChange();
  }

  yearChanged(year) {
    this.date.year = year == null ? null : +year;
    this.loadDays(this.date.month, this.date.year);
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
    this.months = [];
    for (let month = 0; month < 12; month++) {
      this.months.push(month);
    }
    this.changeDetectionRef.detectChanges();
  }

  loadDays(month, year) {
    this.days = [
      ...Array.from({ length: this.daysInMonth(month, year) }, (v, k) => k + 1)
    ];
    this.date.day =
      this.days.findIndex(e => +e === +this.date.day) > -1
        ? this.date.day
        : null;
    this.changeDetectionRef.detectChanges();
  }

  informValueChange() {
    if (
      !this.isNullOrUndefined(this.date) &&
      !this.isNullOrUndefined(this.date.year) &&
      !this.isNullOrUndefined(this.date.month) &&
      !this.isNullOrUndefined(this.date.day)
    ) {
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

  isNullOrUndefined(value): boolean {
    return value === null || value === undefined;
  }

  isInstanceOfSelectionDateInterface(value): boolean {
    return value && value.year && value.month && value.day;
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
    if (this.isNullOrUndefined(month) || this.isNullOrUndefined(year)) {
      return 0;
    }
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
