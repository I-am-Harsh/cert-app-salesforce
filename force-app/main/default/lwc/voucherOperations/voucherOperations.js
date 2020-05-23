import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import getVoucherList from '@salesforce/apex/Fetchdata.vouData';

import VouId from '@salesforce/schema/Voucher__c.Id';
import VouName from '@salesforce/schema/Voucher__c.Voucher_Name__c';
import VouCost from '@salesforce/schema/Voucher__c.Voucher_Cost__c';
import VouVal from '@salesforce/schema/Voucher__c.Validity__c';
import VouAct from '@salesforce/schema/Voucher__c.Active__c';
import VouCert from '@salesforce/schema/Voucher__c.Certification__c';
import VouCom from '@salesforce/schema/Voucher__c.Comments__c';

//actions
const actions = [
    { label: 'Record Details', name: 'record_details' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

// columns
const columns = [
    { label: 'Voucher Id', fieldName: 'Name' },
    { label: 'Voucher Name', fieldName: 'Voucher_Name__c' },
    { label: 'Voucher Cost', fieldName: 'Voucher_Cost__c', type: 'currency', typeAttributes: { currencyCode: 'INR' }, cellAttributes: { alignment: 'left' } },
    { label: 'Voucher Validity', fieldName: 'Validity__c' },
    { label: 'Active', fieldName: 'Active__c' },
    { label: 'Certification Name', fieldName: 'Certification__c' },
    { label: 'Voucher Comments', fieldName: 'Comments__c' },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
        }
    }
];

export default class VoucherOperations extends LightningElement {

    fields = [VouName, VouCost, VouVal, VouAct, VouCert, VouCom];

    // on submit of event
    handleSuccess(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Voila',
            message: 'Voucher Created !',
            variant: 'success'
        }));

        // reload page
        location.reload();
    }

    // track
    @track vouchers;
    @track columns = columns;
    @track record;
    @track currentRecordId;
    @track isEditForm = false;
    @track bShowModal = false;

    error;
    refreshTable;

    // data
    @wire(getVoucherList)
    Voucher__c(result) {
        this.refreshTable = result;
        if (result.data) {
            this.vouchers = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.vouchers = undefined;
            this.error = result.error;
        }
        
        if (this.error != undefined) {
            console.log(this.error);
        } else {
            console.log(result.data);
        }
    }

    // check which action the user has clicked
    handleRowActions(event) {
        let actionName = event.detail.action.name;
        let row = event.detail.row;

        switch (actionName) {
            case 'record_details':
                this.viewVou(row);
                break;
            case 'edit':
                this.editCurrVou(row);
                break;
            case 'delete':
                this.deleteVou(row);
                break;
        }
    }

    // view a specific voucher in modal
    viewVou(currRow) {
        this.bShowModal = true;
        this.isEditForm = false;
        this.record = currRow;
    }

    // trigger when a person closes the modal 
    closeModal() {
        this.bShowModal = false;
    }

    // edit the voucher
    editCurrVou(currRow) {
        this.bShowModal = true;
        this.isEditForm = true;
        this.currentRecordId = currRow.Id;
    }

    // update a voucher
    handleSubmit(event) {
        // console.log("Update method called !");
        this.bShowModal = false;
        this.isEditForm = false;

        // get values 
        const fields = {};
        fields[VouId.fieldApiName] = this.currentRecordId;
        fields[VouName.fieldApiName] = event.detail.fields.Voucher_Name__c;
        fields[VouCost.fieldApiName] = event.detail.fields.Voucher_Cost__c;
        fields[VouVal.fieldApiName] = event.detail.fields.Validity__c;
        fields[VouAct.fieldApiName] = event.detail.fields.Active__c;
        fields[VouCert.fieldApiName] = event.detail.fields.Certification__c;
        fields[VouCom.fieldApiName] = event.detail.fields.Comments__c;
        console.log(fields);

        const recordInp = { fields };

        // update records
        updateRecord(recordInp)
        .then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Voucher Updated !',
                variant: 'success'
            }));
            return refreshApex(this.refreshTable);
        })
        .catch(err => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Error updating Voucher !',
                variant: 'error'
            }));
            console.log('Error aa gaya Bhaiyo');
        });
    }


    // delete a voucher based on row clicked
    deleteVou(currRow) {
        deleteRecord(currRow.Id)
        .then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Deleted',
                message: 'Voucher Deleted Successfully !',
                variant: 'success'
            }));
            return refreshApex(this.refreshTable);
        })
        .catch(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Voucher could not be Deleted !',
                variant: 'error'
            }));
        });
    }

}
