import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EmailTemplate} from "../../../model/email";
import {PopupMessageService} from "../../../service/utils/popup-message.service";
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
  selector: 'app-template-view',
  templateUrl: './template-view.component.html',
  styleUrls: ['./template-view.component.css']
})
export class TemplateViewComponent implements OnInit {

  //accept to edit values
  @Input() allowEdit: boolean = false;
  //show userEmail and sharingLink
  @Input() allowSharing: boolean = false;

  //used when create and edit template where need field name
  @Input() showEmptyName: boolean = false;

  @Input() template: EmailTemplate = {
    name: '',
    subject: '',
    body: '',
  } as EmailTemplate;

  @Output() templateChange = new EventEmitter<EmailTemplate>()

  //validation
  NOT_VALID_STROKE: string = "Must not be empty!"

  editConfig: AngularEditorConfig = {
    showToolbar: true,
    editable: true,
    minHeight: '200px',
    placeholder: "Template body"
  }

  readConfig: AngularEditorConfig = {
    showToolbar: false,
    editable: false,
    minHeight: '200px',
  }

  constructor(private popupMessageService: PopupMessageService) { }

  ngOnInit(): void {
  }

  copySharingLink() {
    if(this.template.sharingLink) {
      let listener = (e: ClipboardEvent) => {
        // @ts-ignore
        e.clipboardData.setData('text/plain', (this.template.sharingLink));
        e.preventDefault();
      };

      document.addEventListener('copy', listener);
      document.execCommand('copy');
      document.removeEventListener('copy', listener);

      this.popupMessageService.showSuccess('Sharing link copied to clipboard!');
      console.log("share link copied to clipboard");

    } else this.popupMessageService.showFailed('Sharing link not found!');

  }

  isValidStroke(text: string | undefined): boolean {
    return !(text === undefined || text === '');

  }
}
