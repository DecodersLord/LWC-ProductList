# Salesforce LWC Product Management App

## Some Assumptions

- Product is Product2 Standard Salesforce object.
- Product Category is based on Product2 Family Field Picklist values.
- Product can have duplicate Name but not Duplicate Product Code working as a Primary Key.
- Trigger handles check for NULL or Duplicate Product Code value when a product is Created or Updated.
- View Product option uses Navigation Mixing to open product details in a new tab.
- New/Edit Product support only Product Code, Name, Price and Description Fields.

## Possible Enhancements 

- View Product can be handled by record-edit-form in a read-only format instead of Navigation Mixing.
- Possibility to add sort/search based on Product Name/Code/Price.
- 
