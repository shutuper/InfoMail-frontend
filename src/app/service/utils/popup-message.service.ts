import { Injectable } from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class PopupMessageService {

  constructor(private messageService: MessageService) { }

  showSuccess(message: string){
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: message
    });
  }

  showFailed(message: string){
    this.messageService.add({
      severity: 'error',
      summary: 'Failed',
      detail: message
    });
  }

  showInfo(message: string){
    this.messageService.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: message
    });
  }
}
