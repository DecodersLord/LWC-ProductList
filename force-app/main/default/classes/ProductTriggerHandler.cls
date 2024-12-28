public with sharing class ProductTriggerHandler {
    
    public static void checkForDuplicate(List<Product2> products){
        Set<String> productCode = new Set<String>();
        for(Product2 product : products){
            productCode.add(product.ProductCode);
        }

        if(productCode.size() > 0){
            List<Product2> existingProducts = [SELECT Id, Name, ProductCode FROM Product2 WHERE ProductCode IN :productCode];

            for(Product2 product : products){
                if(existingProducts.size() > 0){
                    product.ProductCode.addError('Product Code already exists');
                }
            }
            
        }
    }

    public static void handleNullProductCode(Product2 newProduct){
        System.debug('here ' + newProduct);
        newProduct.ProductCode.addError('Product Code is Mandatory');
    }
}