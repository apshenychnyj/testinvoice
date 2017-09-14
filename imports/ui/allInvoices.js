import './allInvoices.html';

Template.allInvoices.helpers({
  invoices(){
    return Invoice.find({},{sort:{created:-1}});
  }
});