import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private router: Router) { }
  title = 'admin';

  ngOnInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
  }
}
