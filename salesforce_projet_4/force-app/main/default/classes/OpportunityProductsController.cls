public with sharing class OpportunityProductsController {
   // Method to get all opportunity products
    @AuraEnabled(Cacheable=true)
    public static List<OpportunityLineItem> getOpportunityProducts(Id oppId) {
        return OpportunitySelector.getOpportunityProducts(oppId);  
    }

    // Method to delete a product (OpportunityLineItem)
    @AuraEnabled
    public static void deleteProduct(Id lineItemId) {
        OpportunityLineItem lineItem = [SELECT Id FROM OpportunityLineItem WHERE Id = :lineItemId];
        delete lineItem;
    }
}