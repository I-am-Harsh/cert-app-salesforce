public with sharing class CertificationRequestDomain {
    CertificationRequestSelector certReqSelector = new CertificationRequestSelector();
    public static fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(new Schema.SObjectType[] { Certification_Request__c.SObjectType });
    VoucherSelector voucherSelector = new VoucherSelector(); 

    
    public CertificationRequestDomain(List<Certification_Request__c> sObjectList){
        super(sObjectList);
    }
    
    public class Constructor implements fflib_SObjectDomain.IConstructable {
        public fflib_SObjectDomain construct(List<SObject> sObjectList) {
            return new CertificationRequestDomain(sObjectList);
        }
    }

    //auto voucher code
    // after update code

    public void AutoVoucher(){
        List<Certification_Request__c> requestList = certReqSelector.getAllCertificationRequests();
        if(!requestList.isEmpty()){
            for(Certification_Request__c req : requestList){
                if(req.Status__c == 'Approved' && req.Voucher__c == null){
                    List<Voucher__c> voucherList = voucherSelector.getActiveVoucherByCertificationId(req.Certification__c);
                    if(!voucherList.isEmpty()){
                        req.Voucher__c = voucherList[0].Id;
                        uow.registerDirty(req);
                    }
                }
            }
        }
    }

    // before insert
    public void CheckingDuplicates(){
        for(Certification_Request__c certReq : (List<Certification_Request__c> Records)){
            if(certReq.Voucher__c != null){
                //create selector method
                List<Certification_Request__c> existingCertReq = certReqSelector.getCertRequestByCertIdandVouId(certReq.Certification__c, certReq.Voucher__c);
                if(!existingCertReq.isEmpty()){
                    certReq.addError('Cannot Use Same Certification and Voucher Details Again, Request Already Pending !');
                }
            }
        }
    }

    //before insert
    public void EmployeeDuplicate(){
        for(Certification_Request__c certReqNew : (List<Certification_Request__c> Records)){
            List<Certification_Request__c> oldCertReqs = certReqSelector.getCertByEmpId(certReqNew.Employee__c);
            if ( oldCertReqs.size() > 0 ) {
                oldCertReqs.Employee__c.addError(' Certification Request for this Employee already exists !');
            }
        }
    }

}
