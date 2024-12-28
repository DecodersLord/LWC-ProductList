trigger ProductTrigger on Product2 (before insert, before update) {
    if(Trigger.isBefore){
        for(Product2 newProduct : Trigger.new){
            if(newProduct.ProductCode == null || newProduct.ProductCode == ''){
                ProductTriggerHandler.handleNullProductCode(newProduct);
            }
        }
        if(Trigger.isInsert){
            ProductTriggerHandler.checkForDuplicate(Trigger.new);
        }
        else if(Trigger.isUpdate){
            for(Id productId : Trigger.newMap.keySet()){
                if(Trigger.oldMap.get(productId).ProductCode != Trigger.newMap.get(productId).ProductCode){
                    ProductTriggerHandler.checkForDuplicate(Trigger.new);
                }
            }
        }
    }
}