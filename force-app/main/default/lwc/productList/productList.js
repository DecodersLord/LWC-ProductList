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
    @track productsMapByCategory = [];
    @track showModalPopup = false;

    @wire(getProducts, {productCategory: '$productCategory'})
    wiredProducts({data, error}){
        if(data){
            this.productsMapByCategory = this.groupProductsByCategory(data);
            console.log(this.productsMapByCategory);
        }
        else if(error){
            return (this.contacts.error) ? reduceErrors(this.contacts.error) : [];
            
        }
    }


    groupProductsByCategory(products){
        let productsMap = new Map();
        for(let product of products){
            if(!productsMap.has(product.Family)){
                productsMap.set(product.Family, [product]);
            }
            else{
                productsMap.get(product.Family).push(product);  
            }
        }

        let result = [];
        productsMap.forEach((value, key) => {
            result.push({
                key: key,
                value: value,
            })
        })
        console.log(result);
        return result;
    }

    get productsMapEntries() {
        return Array.from(this.productsMap.entries());
    }

    @api
    searchProductsByCategory(productCategory){
        console.log(productCategory);
        this.productCategory = productCategory;
    }

    @api
    handleModalPopUp(showModal){
        console.log(showModal);
        this.showModalPopup = showModal;
    }

    handleClose(){
        this.showModalPopup = false;
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