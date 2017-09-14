import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);


Customer = new Mongo.Collection('customers');

CustomerSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
  },
  address: {
    type: Object
  },
  'address.line1': {
    type: String,
    label: "Address line 1"
  },
  'address.city': {
    type: String,
    label: "City"
  },
  'address.country': {
    type: String,
    label: 'Country'
  }
}, { tracker: Tracker });

Customer.attachSchema(CustomerSchema);

Customer.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
