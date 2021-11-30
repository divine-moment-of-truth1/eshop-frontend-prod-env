import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import {  Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentCategoryId: string;
  endSub$: Subject<any> = new Subject(); 

  constructor(private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute) {}


  ngOnInit(): void {
      this.form = this.formBuilder.group({
          name: ['', Validators.required],
          icon: ['', Validators.required],
          color: ['#fff']
      });

      this._checkEditMode();
  }

  ngOnDestroy(): void {
    this.endSub$.next();
    this.endSub$.complete();
  }

  onSubmit() {
      this.isSubmitted = true;

      if(this.form.invalid) {
          return;
      }

      const category: Category = {
          id: this.currentCategoryId,
          name: this.categoryForm.name.value,
          icon: this.categoryForm.icon.value,
          color: this.categoryForm.color.value
      }

      if(this.editMode) {
        this._updateCategory(category);
      } else {
        this._addCategory(category);
      }
  }

  get categoryForm() {
      return this.form.controls
  }


  private _checkEditMode() {
      this.route.params
        .pipe(takeUntil(this.endSub$))
        .subscribe(params => {
            if(params.id) {
              this.editMode = true;
              this.currentCategoryId = params.id;
              this.categoriesService.getCategoryById(params.id)
                .pipe(takeUntil(this.endSub$))
                .subscribe(category => {
                    this.categoryForm.name.setValue(category.name);
                    this.categoryForm.icon.setValue(category.icon);
                    this.categoryForm.color.setValue(category.color);
                })
          }
      })
  }


  private _updateCategory(category: Category) {
    this.categoriesService
        .updateCategory(category)
        .pipe(takeUntil(this.endSub$))
        .subscribe(
            (category: Category) => {
                this.messageService.add({
                    severity:'success',
                    summary:'Success',
                    detail:`Category ${category.name} was updated`
                });
                timer(2000)
                    .toPromise()
                    .then(done => {
                        this.location.back()
                })
            },
        () => {
        this.messageService.add({
            severity:'error',
            summary:'Error',
            detail:'Category NOT updated'
        });
    });
  }


  private _addCategory(category: Category) {
    this.categoriesService
        .createCategory(category)
        .pipe(takeUntil(this.endSub$))
        .subscribe(
            (category: Category) => {
                this.messageService.add({
                    severity:'success',
                    summary:'Success',
                    detail:`Category ${category.name} was created`
                });
                timer(2000)
                    .toPromise()
                    .then(() => {
                        this.location.back()
                });
            }, 
        () => {
            this.messageService.add({
                severity:'error',
                summary:'Error',
                detail:'Category NOT created'
            });
      });
  }

  onCancel() {
    this.location.back()
  }

}
