import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category, Product, CategoriesService, ProductsService } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentProductId: string;
  categories: Category[];
  imageDisplay: string | ArrayBuffer;
  endSub$: Subject<any> = new Subject();

  constructor( private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute 
  ) { }


  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  ngOnDestroy(): void {
      this.endSub$.next();
      this.endSub$.complete();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
        name: ['', Validators.required],
        brand: ['', Validators.required],
        price: ['', Validators.required],
        category: ['', Validators.required],
        countInStock: ['', Validators.required],
        description: ['', Validators.required],
        richDescription: [''],
        image: ['', Validators.required],
        isFeatured: [false]
    });
  }


  onSubmit() {
      this.isSubmitted = true;
      
      if(this.form.invalid) return;

      const productFormData = new FormData();

      Object.keys(this.productForm).map((key) => {
          productFormData.append(key, this.productForm[key].value)
      });

      if(this.editMode) {
        this._updateProduct(productFormData);
      } else {
        this._addProduct(productFormData);
      }
  }


  private _addProduct(productData: FormData) {
    this.productService.createProduct(productData)
        .pipe(takeUntil(this.endSub$))
        .subscribe(
            (product: Product) => {
                this.messageService.add({
                    severity:'success',
                    summary:'Success',
                    detail:`Product ${product.name} was created`
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
                    detail:'Product NOT created'
                });
        });
  }


  private _updateProduct(productData: FormData) {
    this.productService.updateProduct(productData, this.currentProductId)
        .pipe(takeUntil(this.endSub$))
        .subscribe(
            (product) => {
                this.messageService.add({
                    severity:'success',
                    summary:'Success',
                    detail:`Product ${product.name} was updated`
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
                detail:'Product NOT updated'
            });
        });
  }


  onCancel() {
      this.location.back();
  }


  onImageUpload(event) {
    const file = event.target.files[0];
    
    if(file) {
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
        
        const fileReader = new FileReader();
        fileReader.onload = () => {
            this.imageDisplay = fileReader.result;
        };
        fileReader.readAsDataURL(file);
    }
  }


  private _getCategories() {
    this.categoriesService.getCategories()
        .pipe(takeUntil(this.endSub$))
        .subscribe((categories) => {
        this.categories = categories;
        });
  }


  get productForm() {
    return this.form.controls
  }


  private _checkEditMode() {
    this.route.params
        .pipe(takeUntil(this.endSub$))
        .subscribe(params => {
            if(params.id) {
                this.editMode = true;
                this.currentProductId = params.id;
                this.productService.getProductById(params.id).subscribe(product => {
                    this.productForm.name.setValue(product.name);
                    this.productForm.category.setValue(product.category.id);
                    this.productForm.brand.setValue(product.brand);
                    this.productForm.price.setValue(product.price);
                    this.productForm.countInStock.setValue(product.countInStock);
                    this.productForm.isFeatured.setValue(product.isFeatured);
                    this.productForm.description.setValue(product.description);
                    this.productForm.richDescription.setValue(product.richDescription);
                    this.productForm.image.setValidators([]);
                    this.productForm.image.updateValueAndValidity();
                })
            }
        })
  }

}
