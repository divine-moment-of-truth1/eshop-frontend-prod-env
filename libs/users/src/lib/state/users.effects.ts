import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as UsersActions from './users.actions';
import { catchError, concatMap, map } from 'rxjs/operators';
import { LocalstorageService } from '../services/localstorage.service';
import { of } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable()
export class UsersEffects {
  buildUserSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.buildUserSession),
      concatMap(() => {
        if (this.localstorageService.isValidToken()) {
          console.log("TOKEN IS VALID:- " + this.localstorageService.isValidToken())
          const userId = this.localstorageService.getUserIdFromToken();
          if (userId) {
            return this.usersService.getUserById(userId).pipe(
              map((user) => {
                console.log("User is:- " + user)
                return UsersActions.buildUserSessionSuccess({ user: user });
              }),
              catchError(() => of(UsersActions.buildUserSessionFailed()))
            );
          } else {
            return of(UsersActions.buildUserSessionFailed());
          }
        } else {
          console.log("TOKEN IS NOT VALID")
          return of(UsersActions.buildUserSessionFailed());
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private localstorageService: LocalstorageService,
    private usersService: UsersService
  ) {}
}
