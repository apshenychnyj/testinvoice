import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.extendOptions(['index', 'unique', 'denyInsert', 'denyUpdate']);
Invoice = new Mongo.Collection('invoices');

InvoiceSchema = new SimpleSchema({
  created: {
    type: Date,
    optional: true,
    autoform: { type: 'hidden' },
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  number: {
    type: String,
    autoform: {type: 'hidden'},
    optional: true,
  },
  customer: {
    type: String,
    label: false,
    autoform: {
      class: 'invoiceCustomer',
      options(){
        let customers = Customer.find().fetch();
        return _.map(customers, function(customer) {
          return { label: customer.name, value: customer._id };
        });
      }
    }
  },
  invoiceDiscount: {
    type: Number,
    label: "Discount (%)",
    optional: true,
    min:0,
    max:100,
    autoform: {
      class:'invoiceDiscount'
    }
  },
  invoiceFullPrice: {
    type: Number,
    label: "Full price",
    defaultValue: 0,
    optional: true,
    autoform: {
      class:'invoiceFullPrice'
    }
  }
}, { tracker: Tracker })

Invoice.attachSchema(InvoiceSchema);

Invoice.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Invoice.helpers({
  getCustomerName(){
    return Customer.findOne({_id:this.customer}) ? Customer.findOne({_id:this.customer}).name : "--";
  }
})



Invoice.before.update(function (userId, doc, fieldNames, modifier, options) {
  let fullPrice = Meteor.call('countFullPrice', doc._id, modifier.$set.invoiceDiscount);
  modifier.$set.invoiceFullPrice = fullPrice;
})

InvoiceProduct = new Mongo.Collection('invoiceproducts');
InvoiceProductSchema = new SimpleSchema({
  invoiceId:{
    type:String,
    autoform: {type: 'hidden'},
  },
 product:{
    type: String,
    label: "Product",
    autoform: {
      class:"productClass",
      options(){
        let excludeIds = _.pluck(InvoiceProduct.find({invoiceId:Router.current().params.invoiceId}).fetch(), 'product');
        let products = Product.find({_id:{$nin:excludeIds}},{sort:{name:1}}).fetch();
        return _.map(products, function(product) {
          return { label: product.name, value: product._id };
        });
      }
    }
  },
  quantity: {
    type: SimpleSchema.Integer,
    label: "Quantity",
    min:1,
    defaultValue: 1,
    autoform: {
      class:"quantityClass",
      step:1,
    }
  },
  price: {
    type: Number,
    label: "Price",
    autoform: {
      class:"productPrice",
      readonly:true
    }
  }
})

InvoiceProduct.attachSchema(InvoiceProductSchema);

InvoiceProduct.helpers({
  getProductName(){
    return `${ Product.findOne({_id:this.product}).name }`;
  },
  getProductPrice(){
    return `${ Product.findOne({_id:this.product}).price }`;
  }
})

InvoiceProduct.after.insert(function(userId, doc){
  Meteor.call('updateInvoice', doc.invoiceId);
});

InvoiceProduct.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

