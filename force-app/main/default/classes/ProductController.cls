public with sharing class ProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(String productCategory){
        if(String.isEmpty(productCategory)){
            AuraHandledException auraEx = new AuraHandledException('Product Category is required');
			auraEx.setMessage('Product Category is required');
			throw auraEx;   
        }
        
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
            AuraHandledException auraEx = new AuraHandledException(e.getMessage());
			auraEx.setMessage(e.getMessage());
			throw auraEx; 
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getProductCategories(){
        List<String> categories = new List<String>();
        try {
            Schema.SObjectField productCategories = Product2.Family;
            Schema.DescribeFieldResult fieldDescribe = productCategories.getDescribe();
        	
            for(Schema.PicklistEntry picklistEntry : fieldDescribe.getPicklistValues()){
            	categories.add(picklistEntry.getLabel());    
            }
            
        	
        } catch (Exception e) {
            AuraHandledException auraEx = new AuraHandledException(e.getMessage());
			auraEx.setMessage(e.getMessage());
			throw auraEx;
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
            AuraHandledException auraEx = new AuraHandledException(e.getMessage());
			auraEx.setMessage(e.getMessage());
			throw auraEx; 
        }
    }
}