import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public form: FormGroup;
  public minDate;
  public selectedDates = [];

  ngOnInit(): void {
    this.form = new FormGroup({
      date: new FormControl(null)
    });

    this.form.valueChanges.subscribe(value => {
      this.selectedDates.push(value.date ? { ...value.date } : null);
    });
  }

  changeMinDate() {
    this.minDate = { day: 23, month: 3, year: 1920 };
  }

  setDate() {
    this.form.controls.date.patchValue({ day: 1, month: 7, year: 1990 });
  }
}
