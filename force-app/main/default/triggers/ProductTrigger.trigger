trigger ProductTrigger on Product2 (before insert, before update) {
    if(Trigger.isBefore){
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