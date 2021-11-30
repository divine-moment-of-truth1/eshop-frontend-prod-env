import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'products-categories-banner',
  templateUrl: './categories-banner.component.html',
  styles: [
  ]
})
export class CategoriesBannerComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endSubs$: Subject<any> = new Subject()

  constructor(private categoriesService: CategoriesService, private router: Router) { }

  ngOnInit(): void {
      this.categoriesService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe((cat) => {
          this.categories = cat;
      })
  }

  submitFilter(categoryId: string) {
    this.router.navigate(['/products'], { queryParams: { categoryid: categoryId } });
  }

  ngOnDestroy(): void {
      this.endSubs$.next();
      this.endSubs$.complete();
  }

}
