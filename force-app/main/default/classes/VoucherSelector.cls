public with sharing class VoucherSelector {
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Voucher__c.Id, 
            Voucher__c. Active__c
        };
    }

    public Schema.SObjectType getSObjectType() {
        return  Active__c.sObjectType;
    }

    public List< Voucher__c> selectById(Set<ID> idSet){
        return (List<Voucher__c>) selectSObjectsById(idSet);
    }

    public List<Voucher__c> getActiveVoucherByCertificationId(Id cid){
        String certId = (String) cid;
        String query = String.format(
            'select {0} from {1}' + 
            'where Certification__c = {2} Active__c = true',
            new List<String> {
                getFieldListString(),
                getSObjectName(),
                '\'' + cid + '\'',,

            }
        );

        return (List<Voucher__c>) Database.query(query);
    }
}
