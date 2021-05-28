public with sharing class EmployeeSelector extends fflib_SObjectSelector {
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Employee__c.Id,
            Employee__c.Name,
            Employee__c.Emp_Name__c,
            Employee__c.Employee_Email__c,
            Employee__c.Primary_Skill__c, 
            Employee__c.Secondary_Skill__c, 
            Employee__c.Experience__c, 
            Employee__c.Comments__c
        };
    }

    public Schema.SObjectType getSObjectType() {
        return Employee__c.sObjectType;
    }

    public List<Employee__c> selectById(Set<ID> idSet){
        return (List<Employee__c>) selectSObjectsById(idSet);
    }

    public override String getOrderBy() {
        return 'Id';
    }

    public List<Employee__c> getAllEmployee(Integer recordLimit){
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

        return (List<Employee__c>) Database.query(query);
    }
}
