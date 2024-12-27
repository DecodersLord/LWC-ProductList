@isTest
public with sharing class TestProductController {
    
    @TestSetup
    static void setup(){
        List<Product2> products = new List<Product2>();
		
        Schema.SObjectField productCategories = Product2.Family;
        Schema.DescribeFieldResult fieldDescribe = productCategories.getDescribe();
        
        List<Schema.PicklistEntry> picklistValues = fieldDescribe.getPicklistValues();
        
        for(Integer i=0; i<10;i++){
            Product2 newProduct = new Product2(
                Name = 'Test Product' + i,
                ProductCode = 'TESTPROD' + i,
                isActive = true,
                Family = picklistValues[Integer.valueof(Math.random())].getLabel()
            );

            products.add(newProduct);
        }

        insert products;
    }

    @isTest
    static void testGetProductsAllTypes(){
        Test.startTest();
        List<Product2> allProducts = ProductController.getProducts('All Types');
        Test.stopTest();

        System.Assert.areEqual(10, allProducts.size());
        System.AssertNotEquals(null, allProducts.size());
    }
    
    @isTest
    static void testGetProductsEmptyCategory(){
        Test.startTest();
        try {
            List<Product2> allProducts = ProductController.getProducts('');
        } catch (AuraHandledException ex) {
            System.debug(ex.getMessage());
			System.assertEquals('Product Category is required', ex.getMessage());

        }
        Test.stopTest();
    }
    
    @isTest
    static void testGetProductCategories(){
        Schema.SObjectField productCategories = Product2.Family;
        Schema.DescribeFieldResult fieldDescribe = productCategories.getDescribe();
        
        List<Schema.PicklistEntry> picklistValues = fieldDescribe.getPicklistValues();
        
        Test.startTest();
        List<String> categories = ProductController.getProductCategories();
        Test.stopTest();
        
        System.debug(picklistValues);
        System.assertNotEquals(0, picklistValues.size());
        System.assertEquals(categories.size(), picklistValues.size());
    }
    
    @isTest
    static void testDeleteRecord(){
        Product2 productToBeDeleted = [SELECT Id FROM Product2 LIMIT 1];
        
        Test.startTest();
        ProductController.deleteRecord(productToBeDeleted.Id);
        Test.stopTest();
        
        Product2 deletedProduct = [SELECT Id, isDeleted FROM Product2 WHERE Id = :productToBeDeleted.Id ALL ROWS];
        System.assert(deletedProduct.isDeleted, 'The product should be deleted');
    }
    
    @isTest
    static void testDeleteInvalidRecord(){
        Product2 productToBeDeleted = [SELECT Id FROM Product2 LIMIT 1];
        
        Test.startTest();
        try{
        	ProductController.deleteRecord('InvalidId');    
        }
        catch(AuraHandledException ex){
			System.assert(ex.getMessage() != null, 'Exception Thrown');
        }
        Test.stopTest();
        
    }
}