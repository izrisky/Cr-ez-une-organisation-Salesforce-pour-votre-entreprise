/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */@isTest
private class OpportunityLineItemSelectorTest {
    // Remove instance variable (not compatible with @TestSetup)
    @TestSetup
    static void setup() {
        TestDataFactory.setupTestData();
    }

    @isTest
    static void testGetOpportunityProducts() {
        // Get test Opportunity with its Products
        Opportunity opp = [SELECT Id FROM Opportunity WHERE Name = 'Test Opportunity' LIMIT 1];
        
        Test.startTest();
        List<OpportunityLineItem> results = OpportunityProductsController.getOpportunityProducts(opp.Id);
        Test.stopTest();
        
        // Verify 2 items are returned (matches TestDataFactory setup)
        System.assertEquals(2, results.size(), 'Deux produits devraient être liés à l’opportunité');
    }
    @isTest
    static void testGetOpportunityProduct() {
        // Get test Opportunity with its Products
        Opportunity opp = [SELECT Id FROM Opportunity WHERE Name = 'Test Opportunity' LIMIT 1];
        
        List<OpportunityLineItem> results = OpportunityProductsController.getOpportunityProducts(opp.Id);
        
        Test.startTest();
        OpportunityLineItem result = OpportunityLineItemSelector.getOpportunityProduct(results[0].Id);
        Test.stopTest();

        // Verify 2 items are returned (matches TestDataFactory setup)
        // Verify the correct record is returned
        System.assertNotEquals(null, result, 'Le produit de l’opportunité ne doit pas être null');
        System.assertEquals(results[0].Id, result.Id, 'L’ID de l’élément retourné doit correspondre à celui de test');
    }
    // Remove cleanup method (test data is auto-rolled back)
}