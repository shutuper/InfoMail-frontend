import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-registration-message',
  templateUrl: './registration-message.component.html',
  styleUrls: ['./registration-message.component.css']
})
export class RegistrationMessageComponent implements OnInit {

  SUCCESS_TITLE: string = 'Success :)';
  //private ERROR_TITLE: string = 'Sorry :|';

  MAIL_SEND_MESSAGE: string = "We sent configure message to you email!";
  //private SUCCESS_END_REGISTRATION: string = "Congratulation, now we can login to your account";

  constructor() { }

  ngOnInit(): void {

  }

}
