public with sharing class OpportunitySelector {

    public static List<OpportunityLineItem> getOpportunityProducts(Id oppId) {
        return [SELECT Id, Product2.Name,Quantity, UnitPrice, TotalPrice,Product2.QuantityInStock__c FROM OpportunityLineItem WHERE OpportunityId = :oppId];
    }
}