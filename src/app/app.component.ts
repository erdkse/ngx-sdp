import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public form: FormGroup;
  public selectedDates = [];

  ngOnInit(): void {
    this.form = new FormGroup({
      date : new FormControl(new Date(Date.parse('08/01/1990')))
    });

    this.form.valueChanges.subscribe((value) => {
      this.selectedDates.push(value.date);
    });
  }

}
