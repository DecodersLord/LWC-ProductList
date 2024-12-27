import { LightningElement, wire, track, api } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import { NavigationMixin} from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import getProducts from '@salesforce/apex/ProductController.getProducts';
import deleteRecord from '@salesforce/apex/ProductController.deleteRecord';

import NAME_FIELD from '@salesforce/schema/Product2.Name';
import FAMILY_FIELD from '@salesforce/schema/Product2.Family';
import PRICE_FIELD from '@salesforce/schema/Product2.Price__c';
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
        label: 'Price',
        fieldName: PRICE_FIELD.fieldApiName,
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
    wiredProductResults;
    recordId;

    @wire(getProducts, {productCategory: '$productCategory'})
    wiredProducts(result){
        this.wiredProductResults = result;
        const { data, error } = result;
        if(data){
            this.productsMapByCategory = this.groupProductsByCategory(data);
            console.log(this.productsMapByCategory);
        }
        else if(error){
            return (this.productsMapByCategory.error) ? reduceErrors(this.productsMapByCategory.error) : [];
            
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

    handleRecordDelete(recordId){
        console.log('recordId:', recordId);
        if(recordId){
            deleteRecord({productId : recordId})
            .then(() => {
                this.showSuccessToast(`Record ${recordId} has been deleted.`);
            })
            .catch(error => {
                this.showErrorToast(error.body.message);
            })
        }
    }

    handleRecordCreatedOrEdited(response){
        if(response.detail.productEdited){
            this.showSuccessToast(`Record ${response.detail.productName} has been updated.`);
        }
        else{
            this.showSuccessToast(`Record ${response.detail.productName} has been created.`);
        }
        
        this.refreshData();
    }

    showSuccessToast(message){
        const evt = new ShowToastEvent({
            title: 'Success',
            message: message,
            variant: 'success',
        });
        this.dispatchEvent(evt);
        this.refreshData();
    }

    showErrorToast(message){
        const evt = new ShowToastEvent({
            title: 'Error',
            message: message,
            variant: 'error',
        })
    }

    async refreshData(){
        await refreshApex(this.wiredProductResults);
    }

    @api
    searchProductsByCategory(productCategory){
        console.log(productCategory);
        this.productCategory = productCategory;
    }

    @api
    handleModalPopUp(showModal, recordId){
        console.log(showModal + ' ' + recordId);
        const modalEditForm = this.template.querySelector('c-modal-edit-form');
        if (modalEditForm) {
            modalEditForm.showPopUp(showModal, recordId, 'Product2', this.columns);
        } else {
            console.error('c-modal-edit-form not found');
        }
    }

    handleRowAction(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        console.log(actionName);
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
                this.handleRecordDelete(row.Id);
                break;
            case 'edit':
                this.handleModalPopUp(true, row.Id);
                break;
            default:

        }
    }

}