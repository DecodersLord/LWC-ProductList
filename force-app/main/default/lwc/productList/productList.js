import { LightningElement, wire } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';

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
        type: 'text',
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


export default class ProductList extends LightningElement {
    columns = COLUMNS;
    products;

    @wire(getProducts)
    wiredProducts({data, error}){
        if(data){
            this.products = data;
        }
        else if(error){
            return (this.contacts.error) ? reduceErrors(this.contacts.error) : [];
            
        }
    }

    handleRowAction(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch(actionName){
            case 'delete':
                console.log(row + " " + actionName);
                break;
            case 'edit':
                console.log(row + " " + actionName);
                break;
            default:

        }
    }

}