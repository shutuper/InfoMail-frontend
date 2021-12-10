import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserEmailTemplateService} from "../../service/user-email-template.service";
import {PopupMessageService} from "../../service/utils/popup-message.service";

@Component({
  selector: 'app-sharing-template-page',
  templateUrl: './shared-template-page.component.html',
  styleUrls: ['./shared-template-page.component.css']
})
export class SharedTemplatePageComponent implements OnInit {

  sharingId: string = "";

  constructor(
    private templateService: UserEmailTemplateService,
    private popupMessageService: PopupMessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sharingId = this.route.snapshot.params['sharingId'];
    console.log("sharingId", this.sharingId);
  }

  saveTemplate() {
    console.log("saveTemplateBySharingId", this.sharingId);

    this.templateService.saveTemplateBySharingId(this.sharingId).subscribe({
      next: () => {
        this.popupMessageService.showSuccess('Template successfully added!');
      },
      error: () => this.popupMessageService.showFailed('Template is not added!')
    });
  }

  openMyTemplates() {
    console.log("Navigate to My templates page");
    this.router.navigate(['templates']);
  }

}
