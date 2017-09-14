import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);


Product = new Mongo.Collection('products');

ProductSchema = new SimpleSchema({
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
  name: {
    type: String,
    label: "Name",
  },
  description: {
    type: String,
    label: "Description",
    autoform: {
      type: 'textarea',
      rows: 4,
    },
  },
  price: {
    type: Number,
    label: "Price"
  }
}, { tracker: Tracker })

Product.attachSchema(ProductSchema);

Product.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

