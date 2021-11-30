import { Component, OnInit } from '@angular/core';
import { UsersService } from '@bluebits/users';

@Component({
  selector: 'ngshop-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(private usersService: UsersService) { }

    title = 'ngshop';

    ngOnInit() {
        console.log("Created this.usersFacade.buildUserSession();")
        this.usersService.initAppSession();
    }

}
