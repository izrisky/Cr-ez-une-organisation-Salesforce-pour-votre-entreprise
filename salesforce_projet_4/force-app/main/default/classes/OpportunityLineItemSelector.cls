public with sharing class OpportunityLineItemSelector {
    public static List<OpportunityLineItem> getOpportunityProducts(Id oppId) {
        return [SELECT Id, Product2.Name,Quantity, UnitPrice, TotalPrice,Product2.QuantityInStock__c FROM OpportunityLineItem WHERE OpportunityId = :oppId];
    }
    public static OpportunityLineItem getOpportunityProduct(Id lineItemId) {
        return [SELECT Id FROM OpportunityLineItem WHERE Id = :lineItemId];
    }
}