import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord, updateRecord, deleteRecord } from 'lightning/uiRecordApi';

import getEmployeeList from '@salesforce/apex/Fetchdata.empData';
import { refreshApex } from '@salesforce/apex';
import Employee_Object from '@salesforce/schema/Employee__c';
import IdField from '@salesforce/schema/Employee__c.Id';
import EmpName from '@salesforce/schema/Employee__c.Emp_Name__c';
import EmpEmail from '@salesforce/schema/Employee__c.Employee_Email__c';
import PriSkill from '@salesforce/schema/Employee__c.Primary_Skill__c';
import SecondSkill from '@salesforce/schema/Employee__c.Secondary_Skill__c';
import EmpExp from '@salesforce/schema/Employee__c.Experience__c';
import EmpComm from '@salesforce/schema/Employee__c.Comments__c';

const actions = [
    { label: 'Record Details', name: 'record_details' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    { label: 'Emp No', fieldName: 'Name' },
    { label: 'Name', fieldName: 'Emp_Name__c', type: 'text' },
    { label: 'Email', fieldName: 'Employee_Email__c', type: 'email' },
    { label: 'Primary Skill', fieldName: 'Primary_Skill__c', type: 'text' },
    { label: 'Secondary Skill', fieldName: 'Secondary_Skill__c', type: 'text' },
    { label: 'Experience', fieldName: 'Experience__c', type: 'number' },
    { label: 'Comments', fieldName: 'Comments__c', type: 'text' },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
        }
    }
];

export default class EmployeeOperations extends LightningElement {

    // insert data into the database

    name = '';
    email = '';
    pskill = '';
    sskill = '';
    exp;
    comm = '';

    // store when value from input
    handleChange(event) {
        if (event.target.label == 'Name') {
            this.name = event.target.value;
        } else if (event.target.label == 'Email') {
            this.email = event.target.value;
        } else if (event.target.label == 'Primary Skill') {
            this.pskill = event.target.value;
        } else if (event.target.label == 'Secondary Skill') {
            this.sskill = event.target.value;
        } else if (event.target.label == 'Experience') {
            this.exp = event.target.value;
        } else if (event.target.label == 'Comments') {
            this.comm = event.target.value;
        }
    }

    

    // add employee
    submit(event) {
        
        // create field object with all input
        const fields = {};
        fields[EmpName.fieldApiName] = this.name;
        fields[EmpEmail.fieldApiName] = this.email;
        fields[PriSkill.fieldApiName] = this.pskill;
        fields[SecondSkill.fieldApiName] = this.sskill;
        fields[EmpExp.fieldApiName] = this.exp;
        fields[EmpComm.fieldApiName] = this.comm;
        console.log(fields);

        // create a record object with api name
        const recordInp = { apiName: Employee_Object.objectApiName, fields };

        // insert into records
        createRecord(recordInp)
        .then(() => {
            // show success
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Employee Added !',
                variant: 'success'
            }));
            
            // no dynamic add therefore reload
            location.reload();
        })
        // catch error
        .catch(() => {
            // show fail
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Error Creating Record',
                variant: 'error'
            }));
        });
    }
    

    // fetching data from the database

    @track employees = [];
    @track columns = columns;
    @track record;
    @track currentRecordId;
    @track isEditForm = false;
    @track bShowModal = false;

    error;
    refreshTable;

    // wire 
    @wire(getEmployeeList)
    Employee__c(result) {
        this.refreshTable = result;
        if (result.data) {
            this.employees = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.employees = undefined;
            this.error = result.error;
        }
        console.log(this.error);
    }

    // part ends

    // row action
    handleRowActions(event) {
        let actionName = event.detail.action.name;
        let row = event.detail.row;

        switch (actionName) {
            case 'record_details':
                this.viewEmp(row);
                break;
            case 'edit':
                this.editCurrEmp(row);
                break;
            case 'delete':
                this.deleteEmp(row);
                break;
        }
    }

    // view a record
    viewEmp(currRow) {
        this.bShowModal = true;
        this.isEditForm = false;
        this.record = currRow;
    }

    // lol
    closeModal() {
        this.bShowModal = false;
    }

    // edit
    editCurrEmp(currRow) {
        this.bShowModal = true;
        this.isEditForm = true;
        this.currentRecordId = currRow.Id;
    }

    // when updating vals
    handleSubmit(event) {
        console.log("Update method called !");
        this.bShowModal = false;
        this.isEditForm = false;

        // record field vals for update
        const fields = {};
        fields[IdField.fieldApiName] = this.currentRecordId;
        fields[EmpName.fieldApiName] = event.detail.fields.Emp_Name__c;
        fields[EmpEmail.fieldApiName] = event.detail.fields.Employee_Email__c;
        fields[PriSkill.fieldApiName] = event.detail.fields.Primary_Skill__c;
        fields[SecondSkill.fieldApiName] = event.detail.fields.Secondary_Skill__c;
        fields[EmpExp.fieldApiName] = event.detail.fields.Experience__c;
        fields[EmpComm.fieldApiName] = event.detail.fields.Comments__c;
        console.log(fields);

        const recordInp = { fields };

        // update called
        updateRecord(recordInp)
        .then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'success',
                message: 'Record Updated !',
                variant: 'success'
            }));
            // refresh table after update called
            return refreshApex(this.refreshTable);
        })
        .catch(err => {
            // display err
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error updaing record',
                message: 'Error',
                variant: 'error'
            }));
            console.log(err)
        });
    }

    // delete an emp record
    deleteEmp(currRow) {
        deleteRecord(currRow.Id)
        .then(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Deleted',
                message: 'Record Deleted !',
                variant: 'success'
            }));
            return refreshApex(this.refreshTable);
        })
        .catch(err => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Record could not be Deleted !',
                variant: 'error'
            }));
            console.log(err)
        });
    }
}