trigger CertificationRequestTrigger on Certification_Request__c (before insert, before update, after insert, after update) {
    fflib_SObjectDomain.triggerHandler(CertificationRequestDomain.class);
}