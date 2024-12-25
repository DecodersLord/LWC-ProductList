public with sharing class ProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(){
        try {
            return [SELECT Id, Name, Family,StockKeepingUnit, ProductCode FROM Product2 WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}