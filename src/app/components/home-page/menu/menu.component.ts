import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  sections: { name: string, url: string }[] = [
    {name: 'NEW EMAIL', url: 'newEmail'},
    {name: 'Emails history', url: 'history'},
    {name: 'Scheduled tasks', url: 'tasks'},
    {name: 'My templates', url: 'templates'}
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  goTo(url: string) {
    this.router.navigate([url], {relativeTo: this.route.parent});
  }


}
