public with sharing class ProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(String productCategory){
        String queryString = 'SELECT Id, Name, Family, ProductCode,Price__c FROM Product2 ';    

        try {
            if(productCategory == 'All Types'){
                queryString += 'WITH SECURITY_ENFORCED';
            }
            else{
                queryString += 'WHERE Family = :productCategory WITH SECURITY_ENFORCED';
            }
            return Database.query(queryString);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getProductCategories(){
        List<String> categories = new List<String>();
        try {
            List<AggregateResult> results = [SELECT Family FROM Product2 WITH SECURITY_ENFORCED GROUP BY Family ORDER BY Family ASC];
        
            for (AggregateResult result : results) {
                categories.add((String)result.get('Family'));
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return categories;
    }

    @AuraEnabled
    public static void deleteRecord(String productId){
        System.debug(productId);
        try {
            Product2 productToBeDeleted = [SELECT Id from Product2 WHERE Id =: productId WITH SECURITY_ENFORCED];
            delete productToBeDeleted;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}