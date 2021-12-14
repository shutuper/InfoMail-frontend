import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RepeatType, RepeatTypeAsOption} from "../../../../models/email";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {

  @Output()
  formGroupEE = new EventEmitter<FormGroup>();

  defRepeatAt: RepeatTypeAsOption = {name: "Nothing", repeatType: RepeatType.NOTHING}
  repeatTypeAsOptions:RepeatTypeAsOption[] = [
    {name: "Nothing", repeatType: RepeatType.NOTHING},
    {name: "Every day", repeatType: RepeatType.EVERY_DAY},
    {name: "Every week", repeatType: RepeatType.EVERY_WEEK},
    {name: "Every month", repeatType: RepeatType.EVERY_MONTH},
    {name: "Every year", repeatType: RepeatType.EVERY_YEAR},
  ]

  MIN_DATE_SendDateTime = this.dateAdd(new Date(), 'minute', 4);
  MIN_DATE_EndDate = this.dateAdd(new Date(), 'minute', 10);

  form: FormGroup = new FormGroup({
    sendDateTime: new FormControl(
      this.dateAdd(new Date(), 'minute', 10),
      [this.timeIsOver('minute', 4)]),
    repeatTypeAsOption: new FormControl(this.defRepeatAt),
    endDate: new FormControl(
      new Date(),
      [this.dayIsOver()]),
  })

  constructor() { }

  ngOnInit(): void {
    this.formGroupEE.emit(this.form);
    this.endDate?.disable();
  }

  get sendDateTime() { return this.form.get('sendDateTime'); }

  get repeatType(): RepeatType {
    return this.form.get('repeatTypeAsOption')?.value.repeatType;
  }

  get endDate() { return this.form.get('endDate'); }

  whenRepeatTypeChange() {
    console.log("repeatTypeChange");
    switch (this.repeatType) {
      case RepeatType.NOTHING: {
        this.endDate?.disable();
        break;
      }
      default: {
        this.endDate?.enable();
        break;
      }
    }
  }

  isTypesSame(t1: RepeatType, t2: RepeatType): boolean {
    return t1 === t2;
  }

  timeIsOver(interval: string, units: number): ValidatorFn {
    console.log('timeIsOver')
    return (control: AbstractControl): ValidationErrors | null => {
      if(!control.value) return {timeIsOver: true};
      const controlData: Date = control.value;
      const recommendedDate = this.dateAdd(new Date(), interval, units);
      return (controlData.getTime() > recommendedDate.getTime()) ? null: {timeIsOver: true};
    };
  }

  dayIsOver(): ValidatorFn {
    console.log('dayIsOver')
    return (control: AbstractControl): ValidationErrors | null => {
      if(!control.value) return {dayIsOver: true};

      let inputData: Date = control.value;
      inputData = new Date(inputData.getFullYear(), inputData.getMonth(), inputData.getDate());
      let nowData: Date = new Date();
      nowData = new Date(nowData.getFullYear(), nowData.getMonth(), nowData.getDate());

      // console.log('inputData', inputData)
      // console.log('nowData', nowData)

      return (inputData.getTime() >= nowData.getTime()) ? null: {dayIsOver: true};
    };
  }

  showValidity(controleName: string) {
    return this.form.controls[controleName].dirty || this.form.controls[controleName].invalid;
  }


  /**
   * Adds time to a date. Modelled after MySQL DATE_ADD function.
   * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
   * https://stackoverflow.com/a/1214753/18511
   *
   * @param date  Date to start with
   * @param interval  One of: year, quarter, month, week, day, hour, minute, second
   * @param units  Number of units of the given interval to add.
   */
  dateAdd(date: Date, interval: string, units: number): Date {
    var ret = new Date(date); //don't change original date
    var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
    switch(String(interval).toLowerCase()) {
      case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
      case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
      case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
      case 'day'    :  ret.setDate(ret.getDate() + units);  break;
      case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
      case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
      default       :  ret = new Date();  break;
    }
    return ret;
  }
}
