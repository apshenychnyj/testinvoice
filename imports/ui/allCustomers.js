import './allCustomers.html';

Template.customers.helpers({
  customers(){
    return Customer.find();
  },
  fullAddress(){
    return `${this.address.line1}, ${this.address.city}. ${this.address.country}`
  }
});

Template.customers.events({
  'click .newCustomer'(e,t){
    $('#customerEdit').modal('show')
  },
  'click .editCustomer'(e,t){
    Session.set('editCustomer', this._id);
    $('#customerEdit').modal('show')
  }
});
