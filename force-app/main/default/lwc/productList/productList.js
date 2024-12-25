import { LightningElement, wire, track, api } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import { NavigationMixin} from 'lightning/navigation';

import getProducts from '@salesforce/apex/ProductController.getProducts';

import NAME_FIELD from '@salesforce/schema/Product2.Name';
import FAMILY_FIELD from '@salesforce/schema/Product2.Family';
import SKU_FIELD from '@salesforce/schema/Product2.StockKeepingUnit';
import CODE_FIELD from '@salesforce/schema/Product2.ProductCode';



const ACTIONS = [
    {label: 'Edit', name: 'edit'},
    {label: 'Delete', name: 'delete'}
]

const COLUMNS = [
    {
        label: 'Code',
        fieldName: CODE_FIELD.fieldApiName,
        type: 'button',
        typeAttributes: {
            label: {
                fieldName: CODE_FIELD.fieldApiName
            },
            name: 'view',
            variant: 'base'
        }
    },
    {
        label: 'Name',
        fieldName: NAME_FIELD.fieldApiName,
        type: 'text',
    },
    {
        label: 'Family',
        fieldName: FAMILY_FIELD.fieldApiName,
        type: 'text',
    },
    {
        label: 'SKU',
        fieldName: SKU_FIELD.fieldApiName,
        type: 'text',
    },
    {
        type: 'action',
        typeAttributes: { rowActions: ACTIONS, menuAlignment: 'auto' },
    }
]


export default class ProductList extends NavigationMixin(LightningElement) {
    columns = COLUMNS;
    productCategory = 'All Types';
    @track products;

    @wire(getProducts, {productCategory: '$productCategory'})
    wiredProducts({data, error}){
        if(data){
            this.products = data;
        }
        else if(error){
            return (this.contacts.error) ? reduceErrors(this.contacts.error) : [];
            
        }
    }

    @api
    searchProductsByCategory(productCategory){
        console.log(productCategory);
        this.productCategory = productCategory;
    }

    handleRowAction(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch(actionName){
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Product2',
                        actionName: 'view'
                    }
                });
                console.log(row + " " + actionName);
                break;
            case 'delete':
                console.log(row + " " + actionName);
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Product2',
                        actionName: 'edit'
                    }
                });
                console.log(row + " " + actionName);
                break;
            default:

        }
    }

}