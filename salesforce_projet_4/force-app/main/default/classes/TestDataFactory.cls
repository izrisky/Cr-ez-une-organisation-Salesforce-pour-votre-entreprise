@isTest
public class TestDataFactory {
    public static void setupTestData() {
        // Create and insert standard Pricebook2 first
        Pricebook2 standardPb = new Pricebook2(
            Id = Test.getStandardPricebookId(),
            IsActive = true
        );
        update standardPb;
        
        // Create custom Pricebook2
        Pricebook2 pb = new Pricebook2(Name='Liste des prix - FRANCE', IsActive=true);
        insert pb;

        // Create products
        List<Product2> products = new List<Product2>();
        products.add(new Product2(Name='Tesla Model S', ProductCode='TES-MS', Description='Voiture électrique haut de gamme avec une autonomie de 652 km et une accélération de 0 à 100 km/h en 2,5 secondes', Family='Voitures électriques', StockKeepingUnit='TES-MS-2022-' + DateTime.now().getTime(), QuantityInStock__c=50));
        products.add(new Product2(Name='Ford Mustang Mach-E', ProductCode='FORD-MM', Description='SUV électrique avec une autonomie de 491 km et une accélération de 0 à 100 km/h en 3,7 secondes', Family='Voitures électriques', StockKeepingUnit='FORD-MM-2022-' + DateTime.now().getTime(), QuantityInStock__c=75));
        products.add(new Product2(Name='Audi e-Tron', ProductCode='AUDI-ET', Description='SUV électrique avec une autonomie de 436 km et une accélération de 0 à 100 km/h en 5,7 secondes', Family='Voitures électriques', StockKeepingUnit='AUDI-ET-2022-' + DateTime.now().getTime(), QuantityInStock__c=100));
        products.add(new Product2(Name='Toyota Corolla Hybride', ProductCode='TOY-CH', Description='Voiture hybride compacte avec une consommation de carburant de 4,2 L/100 km et une puissance de 122 ch', Family='Voitures hybrides', StockKeepingUnit='TOY-CH-2022-' + DateTime.now().getTime(), QuantityInStock__c=150));
        products.add(new Product2(Name='Honda Civic', ProductCode='HON-CIV', Description='Voiture compacte avec une consommation de carburant de 6,2 L/100 km et une puissance de 158 ch', Family='Voitures à essence', StockKeepingUnit='HON-CIV-2022-' + DateTime.now().getTime(), QuantityInStock__c=200));
        insert products;

        List<PricebookEntry> pbeList = new List<PricebookEntry>();
        
        // Create standard PricebookEntries
        for(Product2 prod : products) {
            pbeList.add(new PricebookEntry(
                Pricebook2Id = standardPb.Id,
                Product2Id = prod.Id,
                UnitPrice = 25000,
                IsActive = true
            ));
        }
        
        // Create custom PricebookEntries
        Map<String, Decimal> productPrices = new Map<String, Decimal>{
            'TES-MS' => 99990,
            'FORD-MM' => 69900,
            'AUDI-ET' => 82400,
            'TOY-CH' => 28990,
            'HON-CIV' => 26990
        };
        
        for(Product2 prod : products) {
            pbeList.add(new PricebookEntry(
                Pricebook2Id = pb.Id,
                Product2Id = prod.Id,
                UnitPrice = productPrices.get(prod.ProductCode),
                IsActive = true
            ));
        }
        
        insert pbeList;

        // Create Opportunity
        Opportunity opp = new Opportunity(
            Name = 'Test Opportunity',
            StageName = 'Prospecting',
            CloseDate = Date.today().addDays(10),
            Pricebook2Id = pb.Id  // Set the custom pricebook
        );
        insert opp;

        // Create OpportunityLineItems
        List<OpportunityLineItem> oppItems = new List<OpportunityLineItem>();
        oppItems.add(new OpportunityLineItem(
            OpportunityId = opp.Id,
            PricebookEntryId = pbeList[5].Id,  // Using custom pricebook entry
            Quantity = 1,
            UnitPrice = 99990
        ));
        oppItems.add(new OpportunityLineItem(
            OpportunityId = opp.Id,
            PricebookEntryId = pbeList[6].Id,  // Using custom pricebook entry
            Quantity = 50,
            UnitPrice = 69900
        ));
        insert oppItems;
    }
}