
Meteor.publishRelations('allInvoices', function(){
  this.cursor(Invoice.find(), function(id, doc){
    this.cursor(Customer.find({_id:doc.customer}));
  });
  return this.ready();
});

Meteor.publish('products.all', function () {
    return Product.find({},{sort:{created:1}})
});

Meteor.publish('products.product', function (productId) {
  return productId ? Product.find({_id:productId}) : [];

});

Meteor.publish('customers.all', function () {
  return Customer.find();
});

Meteor.publishRelations('invoice.work', function(invoiceId){
  this.cursor(Product.find());
  this.cursor(Customer.find());
  if(invoiceId){
    this.cursor(Invoice.find({_id:invoiceId}), function(id, doc){
      this.cursor(InvoiceProduct.find({invoiceId:id}));
    });
  }
  return this.ready();
})
