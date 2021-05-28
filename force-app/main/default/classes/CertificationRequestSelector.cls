public with sharing class CertificationRequestSelector extends fflib_SObjectSelector {
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Certification_Request__c.Certification__c, 
            Certification_Request__c.Voucher__c, 
            Certification_Request__c.Status__c,
            Certification_Request__c.Comments__c, 
            Certification_Request__c.Due_Date__c, 
            Certification_Request__c.Employee__c, 
            Certification_Request__c.Id, 
            Certification_Request__c.Name
        };
    }

    public Schema.SObjectType getSObjectType() {
        return Certification_Request__c.sObjectType;
    }

    public override String getOrderBy() {
        return 'Id ASC NULL FIRST';
    }


    public List<Certification_Request__c> selectById(Set<ID> idSet){
        return (List<Certification_Request__c>) selectSObjectsById(idSet);
    }

    public List<Certification_Request__c> getAllCertificationRequests(){
        String query = String.format(
            'select {0} from {1}',
            new List<String> {
                getFieldListString(),
                getSObjectName()
            }
        );

        return (List<Certification_Request__c>) Database.query(query);
    }

    public List<Certification_Request__c> getCertRequestByCertIdandVouId(Id certId, Id vouId){
        String certificationId = (String) certId;
        String voucherId = (String) vouId;
        String query = String.format(
            'select {0} from {1}' + 
            'where Certification__c = {2} Voucher__c = {3}',
            new List<String> {
                getFieldListString(),
                getSObjectName(),
                '\'' + certificationId + '\'',
                '\'' + voucherId + '\''
            }
        );

        return (List<Certification_Request__c>) Database.query(query);
    }


    public List<Certification_Request__c> getCertByEmpId(Id empId){
        String employeeId = (String) empId;
        String query = String.format(
            'select {0} from {1}' + 
            'where Employee__c = {2}',
            new List<String> {
                getFieldListString(),
                getSObjectName(),
                '\'' + employeeId + '\''
            }
        );

        return (List<Certification_Request__c>) Database.query(query);
    }

    public List<Certification_Request__c> getAllCertificationRequests(Integer recordLimit){
        String query = String.format(
            'select {0} from {1}' + 
            'order by {2} limit {3}',
            new List<String> {
                getFieldListString(),
                getSObjectName(),
                getOrderBy(),
                String.valueOf(recordLimit)
            }
        );

        return (List<Certification_Request__c>) Database.query(query);
    }
    
}
