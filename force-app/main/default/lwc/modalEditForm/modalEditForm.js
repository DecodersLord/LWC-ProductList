import { wire, api, LightningElement, track } from 'lwc';

export default class ModalEditForm extends LightningElement {
    @api recordId;
    @track showModal;
    objectApiName;
    fields;
    isEdit;

    @api
    showPopUp(showModal, recordId, objectApiName, columns) {
        console.log(showModal + ' ' + recordId + ' ' + objectApiName);
        this.showModal = showModal;
        this.recordId = recordId;
        if(recordId){
            this.isEdit = true;
        }
        else{
            this.isEdit = false;
        }
        this.objectApiName = objectApiName;
        this.fields = columns;
    }

    handleClose(){
        this.showModal = false;
    }

    handleSubmit(event){
        event.preventDefault();
        const fields = event.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event){

        const fields = event.detail.fields;
        const productName = fields.Name.value;

        this.showModal = false;
        const newRecordEditFormEvent = new CustomEvent('recordcreatedoredited', {
            detail: {
                recordId: this.recordId,
                productName: productName,
                productEdited: this.isEdit
            }
        });
        this.dispatchEvent(newRecordEditFormEvent);
    }
}