public with sharing class VoucherSelector {
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Voucher__c.Id, 
            Voucher__c. Active__c,
            Voucher__c.Name, 
            Voucher__c.Certification__r.Cert_Name__c, 
            Voucher__c.Comments__c, 
            Voucher__c.Validity__c, 
            Voucher__c.Voucher_Cost__c, 
            Voucher__c.Voucher_Name__c
        };
    }

    public Schema.SObjectType getSObjectType() {
        return  Active__c.sObjectType;
    }

    public List< Voucher__c> selectById(Set<ID> idSet){
        return (List<Voucher__c>) selectSObjectsById(idSet);
    }

    public override String getOrderBy() {
        return 'Id ASC NULL FIRST';
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

    public List<Voucher__c> getAllVoucher(Integer recordLimit){
        String query = String.format(
            'select {0} from {1}' + 
            'order by {2} limit {3}',
            new List<String> {
                getFieldListString(),
                getSObjectName(),
                getOrderBy(),
                String.valueOf(recordLimit)
            }
        )

        return (List<Voucher__c>) Database.query(query);
    }
}
