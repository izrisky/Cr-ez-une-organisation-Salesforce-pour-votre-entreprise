public with sharing class OpportunityProductsController {
    @AuraEnabled(Cacheable=true)
    public static List<OpportunityLineItem> getOpportunityProducts(Id oppId) {
        return OpportunitySelector.getOpportunityProducts(oppId);  
    }

}