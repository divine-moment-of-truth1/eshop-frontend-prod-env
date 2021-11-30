import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'products-search',
  templateUrl: './products-search.component.html',
  styles: [
  ]
})
export class ProductsSearchComponent implements OnInit {

  searchCriteria: string;
  missingSearchText;
  
  constructor(private router: Router) { }

  ngOnInit() {
      this.missingSearchText = false;
      this.searchCriteria = '';
  }

  submitSearch() {
    if (this.searchCriteria != '') {
        this.router.navigate(['/products'], { queryParams: { searchText: this.searchCriteria } });
        this.searchCriteria = "";
        this.missingSearchText = false;
     } else {
        this.missingSearchText = true;
     }
    
  }
}
