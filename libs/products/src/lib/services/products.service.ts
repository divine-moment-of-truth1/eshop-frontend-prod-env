import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';
import { environment } from '@env/environment';
import { ShopParams } from '../models/shopParams';
import { Pagination } from '../models/pagination';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

    apiURLProducts = environment.apiUrl + 'products';

    constructor(private http: HttpClient) { }

    getProducts(sortBy: any, categoriesFilter?: string[]): Observable<Product[]> {
          let params = new HttpParams();

        if (categoriesFilter) {
            params = params.append('categories', categoriesFilter.join(','))
        }

        if (sortBy) {
            params = params.append('sort', sortBy.value)
        }

        //console.log(sortBy);
        
        return this.http.get<Product[]>(this.apiURLProducts, {params : params} );
    }

    getProductsBySearchCriteria(sortBy: any, searchCriteria?: string): Observable<Product[]> {
        console.log(sortBy.value);
        let params = new HttpParams();

        if (searchCriteria) {
            params = params.append('searchText', searchCriteria);
        }

        if (sortBy) {
            params = params.append('sort', sortBy.value)
        }
        
        // console.log(params);

        return this.http.get<Product[]>(this.apiURLProducts, { params: params } );
    }

    getProductsClient(sortBy: any, searchCriteria: string, shopParams: ShopParams, categoriesFilter?: string[]): Observable<any> {
      let params = new HttpParams();

      if (categoriesFilter) {
        params = params.append('categories', categoriesFilter.join(','));
        console.log("Entered - categoriesFilter")
      }

      if (searchCriteria) {
        params = params.append('searchText', searchCriteria);
        console.log("Entered - searchCriteria")
      }

      params = params.append('sort', sortBy.value);
      params = params.append('pageIndex', shopParams.pageNumber.toString());
      params = params.append('pageIndex', shopParams.pageSize.toString());

      console.log("Params sent to product service:- ")

      console.log(params);
      
    //   return this.http.get<Pagination>(this.apiURLProducts, {params : params} );
    return this.http.get<any>(this.apiURLProducts, {params : params} );
    }

    getProductsAdmin(sortBy: any, searchCriteria: string, categoriesFilter?: string[]): Observable<Product[]> {
        let params = new HttpParams();

      if (categoriesFilter) {
        params = params.append('categories', categoriesFilter.join(','))
        console.log("Entered - categoriesFilter")
      }

      if (searchCriteria) {
        params = params.append('searchText', searchCriteria);
        console.log("Entered - searchCriteria")
      }

      if (sortBy) {
        params = params.append('sort', sortBy.value)
        console.log("Entered - sortBy")
      }

      //console.log(sortBy);
      
      return this.http.get<Product[]>(this.apiURLProducts, {params : params} );
    }

    getProductById(productId: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
    }

    createProduct(productData: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiURLProducts, productData)
    }

    deleteProduct(productId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiURLProducts}/${productId}`);
    }

    updateProduct(productData: FormData, productId: string): Observable<Product> {
         return this.http.put<Product>(`${this.apiURLProducts}/${productId}`, productData)
    }

    getProductsCount(): Observable<number> {
        return this.http
            .get<number>(this.apiURLProducts + '/get/count')
            .pipe(map((objectValue: any) => objectValue.productCount));
    }

    getFeaturedProducts(count: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiURLProducts}/get/featured/${count}`);
    }
}
