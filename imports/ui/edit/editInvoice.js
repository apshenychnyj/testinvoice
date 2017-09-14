import './editInvoice.html';

AutoForm.debug();

Template.editInvoice.helpers({
  type(){
    return Router.current().params.invoiceId ? "method-update" : "method";
  },
  doc(){
    return Router.current().params.invoiceId ? Invoice.findOne({_id:Router.current().params.invoiceId}) : {}
  },
  invoiceMethod(){
    return Router.current().params.invoiceId ? "invoiceUpdate" : "invoiceInsert";
  },
  invoiceProducts(){
    return InvoiceProduct.find();
  },
});

Template.editInvoice.events({ 
  'click .addProductToInv'(event, template){
    $('#addProductInv').modal('show');
  },
  'click .addNewCustomer'(event, template){
    $('#customerEdit').modal('show')
  },
  'click .removeInvProduct'(event, template){
    Meteor.call('removeInvProduct', Router.current().params.invoiceId, this._id);
  },
  'click .qtyplus': function(e){
    e.preventDefault();
   fieldName = $('#p'+this._id).attr('field');
   var currentVal = parseInt($('input[name='+fieldName+']').val());
   if (!isNaN(currentVal)) {
       $('input[name='+fieldName+']').val(currentVal + 1).change();
       currentVal = parseInt($('input[name='+fieldName+']').val());
   } else {
       $('input[name='+fieldName+']').val(0);
   }
  //  console.log('currentVal', currentVal);
  //  console.log('this._id', this._id);
   Meteor.call('updateInvProductQuantity', this._id, currentVal);
  },
  'click .qtyminus': function(e){
      e.preventDefault();
      fieldName = $('#m'+this._id).attr('field');
      var currentVal = parseInt($('input[name='+fieldName+']').val());
      if (!isNaN(currentVal) && currentVal > 2) {
          $('input[name='+fieldName+']').val(currentVal - 1).change();
          currentVal = parseInt($('input[name='+fieldName+']').val());
      } else {
          $('input[name='+fieldName+']').val(1);
      }
      // console.log('currentVal', currentVal);
      Meteor.call('updateInvProductQuantity', this._id, currentVal);
  },
  'keydown .input-number': function(e){
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
          // Allow: Ctrl+A
          (e.keyCode == 65 && e.ctrlKey === true) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
              // let it happen, don't do anything
              return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
      }
  },
});

AutoForm.hooks({
  invoiceEdit: {
    onSuccess(error, result) {
      Router.go('editInvoice', {invoiceId:result})
    },
  },
  invoiceProductEdit: {
    onSuccess(error, result) {
      $('#addProductInv').modal('hide');
    }
  }
});

Template.productInvModal.helpers({
  doc(){
    return Session.get('productInvEdit') ? InvoiceProduct.findOne({_id:Session.get('productInvEdit')}) : {invoiceId:Router.current().params.invoiceId, quantity:1}
  },
  type(){
    return Session.get('productInvEdit') ? "method-update" : "method";
  },
  productInvMethod(){
    return Session.get('productInvEdit')  ? "productInvUpdate" : "productInvInsert";
  },
  
});

function setModalPrice(){
  let productPrice = Product.findOne({_id:$('.productClass').val()}).price;
  let quantity = $('.quantityClass').val() ? $('.quantityClass').val() : 1;
  let countPrice = productPrice * parseInt(quantity);
  console.log('countPrice', countPrice);
  $('.productPrice').val(countPrice);
}

Template.productInvModal.events({ 
  'change .productClass': function(event, template) { 
     setModalPrice();
  },
  'change .quantityClass'(event, template) {
      setModalPrice();
  }
});