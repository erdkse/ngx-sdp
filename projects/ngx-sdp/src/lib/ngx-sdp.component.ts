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
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

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
export class NgxSdpComponent
  implements OnInit, OnChanges, ControlValueAccessor {
  public days = [];
  public months = [];
  public years = [];
  @Input()
  minDate: Date;
  @Input()
  showError: boolean = false;
  @Input()
  maxDate: Date;
  @Input()
  language: string = 'en';
  public minYear: number = 1900;
  public maxYear = new Date().getFullYear();
  public monthLabel = MONTH_LABEL;
  public defaultLabel = DEFAULT_LABEL;
  public dateForm: FormGroup;
  public today: Date = new Date();
  public propagateChange = (_: any) => {};

  constructor() {}

  ngOnInit() {
    this.loadYears(this.minDate, this.maxDate);
    this.loadMonths();

    this.dateForm = new FormGroup({
      day: new FormControl(null, Validators.required),
      month: new FormControl(null, Validators.required),
      year: new FormControl(null, Validators.required)
    });

    this.dateForm.controls.year.valueChanges.subscribe(year =>
      this.onValueChanges()
    );

    this.dateForm.controls.month.valueChanges.subscribe(month =>
      this.onValueChanges()
    );

    this.dateForm.controls.day.valueChanges.subscribe(day => {
      this.propagateChange(
        new Date(
          Date.UTC(
            +this.dateForm.controls.year.value,
            +this.dateForm.controls.month.value,
            +this.dateForm.controls.day.value,
            0,
            0,
            0,
            0
          )
        )
      );
    });

    this.dateForm.patchValue({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate()
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.minDate && !changes.minDate.firstChange) {
      this.loadYears(changes.minDate.currentValue, this.maxDate);
    }
    if (changes.maxDate && !changes.maxDate.firstChange) {
      this.loadYears(this.minDate, changes.maxDate.currentValue);
    }
  }

  loadYears(minDate, maxDate) {
    this.minYear = minDate ? minDate.getFullYear() : this.minYear;
    this.maxYear = maxDate ? maxDate.getFullYear() : this.maxYear;
    this.years = [];
    for (let year = this.minYear; year <= this.maxYear; year++) {
      this.years.unshift(year);
    }
  }

  loadMonths() {
    this.months = [];
    for (let month = 0; month < 12; month++) {
      this.months.push(month);
    }
  }

  onValueChanges() {
    if (!this.dateForm.disabled) {
      this.setAvailableDays(
        this.dateForm.controls.month.value,
        this.dateForm.controls.year.value
      );
    }
  }

  setAvailableDays(month, year) {
    this.days = [
      ...Array.from({ length: this.daysInMonth(+month, year) }, (v, k) => k + 1)
    ];

    this.dateForm.controls.day.patchValue(
      this.days.findIndex(e => +e === +this.dateForm.value.day) > -1
        ? +this.dateForm.value.day
        : 1
    );
  }

  writeValue(date): void {
    if (date && !(date instanceof Date)) {
      throw new Error('Input variable is not Date object');
    }

    if (!date) {
      this.dateForm.patchValue({
        year: this.maxDate
          ? this.maxDate.getFullYear()
          : new Date().getFullYear(),
        month: this.maxDate ? this.maxDate.getMonth() : new Date().getMonth(),
        day: this.maxDate ? this.maxDate.getDate() : new Date().getDate()
      });
    }

    if (date instanceof Date) {
      this.dateForm.patchValue({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
      });
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

  daysInMonth(month: number, year: number) {
    if (!month || !year) {
      return 0;
    }
    return new Date(Date.UTC(+year, +month + 1, 0, 0, 0, 0, 0)).getDate();
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
