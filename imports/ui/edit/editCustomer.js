import './editCustomer.html';

Template.editCustomer.helpers({
  modalTitle(){
    return Session.get('editCustomer') ?  "Update customer" : "New customer";
  },
  type(){
    return Session.get('editCustomer') ?  "method-update" : "method";
  },
  doc(){
    return Session.get('editCustomer') ?  Customer.findOne({_id:Session.get('editCustomer') }) : {};
  },
  customerMethod(){
    return Session.get('editCustomer') ?  "customerUpdate" : "customerInsert";
  }
});

AutoForm.hooks({
  edCustomer: {
    onSuccess(error, result) {
      Session.set('editCustomer');
      $('#customerEdit').on('hidden.bs.modal', function (e) {
        if(Router.current().route.getName() == 'editInvoice'){
          $('.invoiceCustomer').val(result);
          $("#invoiceEdit").submit();
        }
      }).modal('hide');
    },
  },
});
