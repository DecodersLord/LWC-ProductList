public with sharing class ProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(String productCategory){
        try {
            if(productCategory == 'All Types'){
                return [SELECT Id, Name, Family,StockKeepingUnit, ProductCode FROM Product2 WITH SECURITY_ENFORCED];
            }
            else{
                return [SELECT Id, Name, Family,StockKeepingUnit, ProductCode FROM Product2 WHERE Family = :productCategory WITH SECURITY_ENFORCED];
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getProductCategories(){
        List<String> categories = new List<String>();
        try {
            List<AggregateResult> results = [SELECT Family FROM Product2 WITH SECURITY_ENFORCED GROUP BY Family ORDER BY Family ASC];
        
            // Extracting the Family values into the categories list
            for (AggregateResult result : results) {
                categories.add((String)result.get('Family'));
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return categories;
    }
}