// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Product } from "../../../../products/src/lib/models/product";

export class Cart {
    items?: CartItem[];
}

export class CartItem {
    // productId?: string;
    product: Product;
    quantity?: number;
}
  
export class CardItemDetail {
    product?: any;
    quantity?: number;
}