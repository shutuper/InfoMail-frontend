import {Component, OnInit} from '@angular/core';
import {EmailTemplate} from "../../model/email";
import {ActivatedRoute} from "@angular/router";
import {UserEmailTemplateService} from "../../service/user-email-template.service";
import {PopupMessageService} from "../../service/utils/popup-message.service";

@Component({
  selector: 'app-sharing-template-page',
  templateUrl: './shared-template-page.component.html',
  styleUrls: ['./shared-template-page.component.css']
})
export class SharedTemplatePageComponent implements OnInit {

  sharedTemplate: EmailTemplate = {} as EmailTemplate;
  SHARING_LINK: string = "http://localhost:4200/shared-templates/";

  constructor(
    private templateService: UserEmailTemplateService,
    private popupMessageService: PopupMessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let sharingId: string = '';
    this.route
      .params.subscribe(params => sharingId = params['sharingId']);

    console.log("sharingId", sharingId);
    if(sharingId != undefined) this.getTemplateBySharingId(sharingId);
  }

  getTemplateBySharingId(sharingId: string) {
    console.log('getTemplateBySharingId', sharingId)
    this.templateService.getTemplateBySharingId(sharingId).subscribe({
      next: (template) => {
        if(template.sharingLink) template.sharingLink = this.setFullLink(template.sharingLink);

        this.sharedTemplate = {...template};
        this.sharedTemplate = {...template};
      },
      error:() => this.popupMessageService.showFailed("Couldn't load template!")
    });
  }

  setFullLink(sharingId: string) {
    return this.SHARING_LINK + sharingId;
  }

  saveTemplate() {

  }
}
