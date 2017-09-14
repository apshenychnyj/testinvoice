import '../ui/layout/layout';
import '../ui/allInvoices';
import '../ui/edit/editCustomer';
import '../ui/allCustomers';
import '../ui/allProducts';
import '../ui/edit/editProduct';
import '../ui/edit/editInvoice';

import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'er404',
});

AppController = RouteController.extend({
  onBeforeAction() {
    return !Meteor.userId() ? this.render('login') : this.next();
  },
});

Router.route('/', {
  name: 'allInvoices',
  title(){return !Meteor.userId() ? "Sign In" : "All invoices" },
  template: 'allInvoices',
  subscriptions(){
    this.subscribe('allInvoices').wait();
  },
  action() {
    return this.ready() ? this.render() : this.render('Loading');
  },
});

Router.route('/editinvoice/:invoiceId?', {
  name: 'editInvoice',
  title: 'edit',
  template: 'editInvoice',
  parent: 'allInvoices',
  subscriptions(){
    this.subscribe('invoice.work', this.params.invoiceId).wait();
  },
  action() {
    return this.ready() ? this.render() : this.render('Loading');
  },
});

Router.route('/customers',{
  name: 'allCustomers',
  title: "Customers",
  template: 'customers',
  parent: 'allInvoices',
  subscriptions(){
    this.subscribe('customers.all').wait();
  },
  action() {
    return this.ready() ? this.render() : this.render('Loading');
  },
})

Router.route('/products', {
  name: 'allProducts',
  title: "Products",
  template: 'products',
  parent: 'allInvoices',
  subscriptions(){
    this.subscribe('products.all').wait();
  },
  action() {
    return this.ready() ? this.render() : this.render('Loading');
  },
});


Router.route('/products/editproduct/:productId?',{
  name: 'editProduct',
  title(){ return Router.current().params.productId ? "Edit product" : "New product" },
  template: "editProduct",
  parent: 'allProducts',
  subscriptions(){
    this.subscribe('products.product', this.params.productId).wait();
  },
  action() {
    return this.ready() ? this.render() : this.render('Loading');
  },
})
