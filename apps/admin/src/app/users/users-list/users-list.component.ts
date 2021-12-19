import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService, User } from '@bluebits/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  endSub$: Subject<any> = new Subject();

  constructor(private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router) { }


  ngOnInit(): void {
        this._getUsers();
  }

  ngOnDestroy(): void {
      this.endSub$.next();
      this.endSub$.complete();
  }


  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this User?',
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(userId)
            .pipe(takeUntil(this.endSub$))
            .subscribe(
            () => {
                this._getUsers();
                this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User is deleted!'
                });
            },
            () => {
                this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'User is not deleted!'
                });
            }
            );
        }
    });
  }


  updateUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`)
  }

  
  getCountryName(countryKey: string) {
    if (countryKey) {
        return this.usersService.getCountry(countryKey);
    }
    else {
        return false;
    }
  }


  private _getUsers() {
    this.usersService.getUsers()
        .pipe(takeUntil(this.endSub$))
        .subscribe(user => {
            this.users = user;
            // Remove admin user from list
            this._removeAdminUser();
        })
  }

  private _removeAdminUser() {
    // admin@email.com
    // password

    // get index of admin user
    const adminUserIndex = this.users.findIndex(user => user.email === "admin@email.com")

    // Remove Admin user from array so that it does not display on Users list page
    this.users.splice(adminUserIndex, 1);

  }

}
