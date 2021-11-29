import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EmailSchedule, RepeatType} from "../../../../model/email";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {

  @Output() onChangeForm = new EventEmitter<EmailSchedule>();

  defRepeatAt: RepeatTypeLabel = {name: "Nothing", value: RepeatType.NOTHING}
  repeatTypeLabels:RepeatTypeLabel[] = [
    {name: "Nothing", value: RepeatType.NOTHING},
    {name: "Every day", value: RepeatType.EVERY_DAY},
    {name: "On work days", value: RepeatType.ON_WORK_DAYS},
    {name: "Every week", value: RepeatType.EVERY_WEEK},
    {name: "Every month", value: RepeatType.EVERY_MONTH},
    {name: "Every year", value: RepeatType.EVERY_YEAR},
  ]

  emailScheduleForm: FormGroup = new FormGroup({
    sendDateTime: new FormControl(''),
    repeatTypeLabel: new FormControl(this.defRepeatAt),
    endDate: new FormControl(''),
  })

  constructor() { }

  ngOnInit(): void {
  }

  sendUpdateValue() {
    this.onChangeForm.emit({
      sendNow: false,
      sendDateTime: this.emailScheduleForm.value.sendDateTime,
      repeatAt: this.emailScheduleForm.value.repeatTypeLabel.value,
      endDate: this.emailScheduleForm.value.endDate
    } as EmailSchedule)
  }

  whenRepeatTypeChange() {
    console.log("repeatTypeChange, repeatAt:", this.emailScheduleForm.value.repeatAt);
  }

  onSubmit() {
    this.sendUpdateValue();
  }


}

interface RepeatTypeLabel {
  name:string;
  value: RepeatType;
}
