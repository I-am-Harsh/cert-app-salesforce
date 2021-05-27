public with sharing class Fetchdata {

    //done
    @AuraEnabled(Cacheable=true)
    public static List<Employee__c> empData() {
        EmployeeSelector empSelector = new EmployeeSelector();
        Integer recordLimit = 10;
        return empSelector.getAllEmployee(recordLimit);
        //return [ SELECT Id, Name, Emp_Name__c, Employee_Email__c, Primary_Skill__c, Secondary_Skill__c, Experience__c, Comments__c FROM Employee__c ORDER BY Id LIMIT 10];
    }

    //done
    @AuraEnabled(Cacheable=true)
    public static List<Certification__c> certData(){
        Integer recordLimit = 10;
        CertificationSelector certSelector = new CertificationSelector();
        return certSelector.getAllCertifications(recordLimit);
        //return [ SELECT Id, Name, Cert_Name__c, Comments__c FROM Certification__c ORDER BY Id LIMIT 10 ];
    }

    //done
    @AuraEnabled(Cacheable=true)
    public static List<Voucher__c> vouData(){
        //return [ SELECT Name, Active__c, Certification__r.Cert_Name__c, Comments__c, Id, Validity__c, Voucher_Cost__c, Voucher_Name__c FROM Voucher__c ORDER BY Id ASC NULLS FIRST LIMIT 10 ];
        Integer recordLimit = 10;
        VoucherSelector vouSelector = new VoucherSelector();
        return vouSelector.getAllVoucher(recordLimit);
    }

    //done
    @AuraEnabled(Cacheable=true)
    public static List<Certification_Request__c> reqData(){
        //return [ SELECT Certification__c, Comments__c, Due_Date__c, Employee__c, Id, Name, Status__c, Voucher__c FROM Certification_Request__c ORDER BY Id ASC NULLS FIRST LIMIT 10 ];
        Integer recordLimit = 10;
        CertificationRequestSelector certReqSelector = new CertificationRequestSelector();
        return certReqSelector.getAllCertificationRequests(recordLimit);
    }

}
