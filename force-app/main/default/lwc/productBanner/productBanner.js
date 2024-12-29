import { LightningElement } from 'lwc';
import { NavigationMixin} from 'lightning/navigation';

export default class ProductBanner extends NavigationMixin(LightningElement) {
    getProductsByCategory(event) {
        const productCategory = event.detail.category;
        console.log('Product Category:', productCategory);

        const productList = this.template.querySelector('c-product-list');
        if (productList) {
            productList.searchProductsByCategory(productCategory);
        } else {
            console.error('c-product-list not found');
        }
    }

}