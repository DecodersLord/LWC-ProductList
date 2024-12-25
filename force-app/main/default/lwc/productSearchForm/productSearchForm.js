import { LightningElement, wire } from 'lwc';
import getProductCategories from '@salesforce/apex/ProductController.getProductCategories';

export default class ProductSearchForm extends LightningElement {
    selectedCategory = 'All Types';

    
    error = undefined;

    searchOptions;

    @wire(getProductCategories)
    productCategories({ errors, data }) {
        if (data) {
            console.log(data);
            this.searchOptions = [{ label: 'All Types', value: 'All Types' }, ...data.map(item => ({ label: item, value: item }))];
    
        } else if (errors) {
            this.searchOptions = undefined;
            this.errors = errors;
        }
    }

    handleCategoryChange(event) {
        
        this.selectedCategory = event.detail.value;
        console.log(this.selectedCategory);
        const searchEvent = new CustomEvent('categorychanged', {
            detail: {category: this.selectedCategory}
        });
        this.dispatchEvent(searchEvent);
    }

}