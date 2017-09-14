import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';

SimpleSchema.debug = true;

export const invoiceInsert = new ValidatedMethod({
  name: 'invoiceInsert',
  validate: InvoiceSchema.validator(),
  run(insertDoc){
      console.log('insertDoc', insertDoc);
      if(this.userId && Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)){
          return Invoice.insert(insertDoc);
      } else {
          throw new Meteor.Error('invoice.insert.accessDenied',
              'Cannot add invoice. No rights');
      }
  }
});

export const invoiceUpdate = new ValidatedMethod({
    name: 'invoiceUpdate',
    validate: new SimpleSchema({
        _id: {
            type: String
        },
        modifier: {
            type: Object,
            blackbox: true
        }
    }).validator(),
    run(modifier, _id){
        if(this.userId && Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)){
            Invoice.update({_id:modifier._id}, modifier.modifier);
            return modifier._id;
        } else {
            throw new Meteor.Error('invoice.update.accessDenied',
                'Cannot update invoice. No rights');
        }
    }
});

//

export const productInvInsert = new ValidatedMethod({
    name: 'productInvInsert',
    validate: InvoiceProductSchema.validator(),
    run(insertDoc){
        if(this.userId && Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)){
            return InvoiceProduct.insert(insertDoc);
        } else {
            throw new Meteor.Error('invproduct.insert.accessDenied',
                'Cannot add product to invoice. No rights');
        }
    }
  });
  
  export const productInvUpdate = new ValidatedMethod({
      name: 'productInvUpdate',
      validate: new SimpleSchema({
          _id: {
              type: String
          },
          modifier: {
              type: Object,
              blackbox: true
          }
      }).validator(),
      run(modifier, _id){
          if(this.userId && Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)){
                InvoiceProduct.update({_id:modifier._id}, modifier.modifier);
              return modifier._id;
          } else {
              throw new Meteor.Error('invproduct.update.accessDenied',
                  'Cannot update invoice product. No rights');
          }
      }
  });

Meteor.methods({
    countFullPrice(invoiceId, newDiscount){
        let invoice = Invoice.findOne({_id:invoiceId});
        let discount;
        if(newDiscount >= 0){
            discount = newDiscount; 
        } else {
            discount = invoice.invoiceDiscount ? invoice.invoiceDiscount : 0; 
        }
        let invoiceProducts = InvoiceProduct.aggregate(
            {$match:{invoiceId:invoiceId}},
            {
                "$group": {
                    "_id": "$invoiceId",
                    "total":{"$sum":'$price'}
                }
            } 
        );
        if(invoiceProducts && invoiceProducts[0].total){
            let price = (1 - discount / 100) * invoiceProducts[0].total;
            return parseFloat(price.toFixed(2));
        } else {
            return 0;
        }
        
    }, 
    updateInvoice: function(invoiceId) { 
        let price = Meteor.call('countFullPrice', invoiceId);
        if(price){
            let a = Invoice.update({_id:invoiceId},{$set:{invoiceFullPrice:parseFloat(price.toFixed(2))}});
        }
    },
    removeInvProduct(invoiceId, ivnProductId){
        InvoiceProduct.remove({_id:ivnProductId});
        Meteor.call('updateInvoice', invoiceId);
    },
    updateInvProductQuantity(ivnProductId, newQuantity){
        let invoiceProduct = InvoiceProduct.findOne({_id:ivnProductId});
        let price = Product.findOne({_id:invoiceProduct.product}).price * newQuantity
        InvoiceProduct.update({_id:ivnProductId},{$set:{quantity:newQuantity, price:price}});
        Meteor.call('updateInvoice', invoiceProduct.invoiceId);
    }
});