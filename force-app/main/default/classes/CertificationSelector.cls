public with sharing class CertificationSelector {
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Certification__c.Id, 
            Certification__c.Name, 
            Certification__c.Cert_Name__c, 
            Certification__c.Comments__c
        };
    }

    public Schema.SObjectType getSObjectType() {
        return Certification__c.sObjectType;
    }

    public List<Certification__c> selectById(Set<ID> idSet){
        return (List<Certification__c>) selectSObjectsById(idSet);
    }

    public override String getOrderBy() {
        return 'Id';
    }

    public List<Certification__c> getAllCertifications(Integer recordLimit){
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

        return (List<Certification__c>) Database.query(query);
    }
}
