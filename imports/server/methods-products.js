import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

export const productInsert = new ValidatedMethod({
  name: 'productInsert',
  validate: ProductSchema.validator(),
  run(insertDoc){
      if(this.userId && Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)){
          return Product.insert(insertDoc);
      } else {
          throw new Meteor.Error('product.insert.accessDenied',
              'Cannot add product. No rights');
      }
  }
});

export const productUpdate = new ValidatedMethod({
    name: 'productUpdate',
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
            Product.update({_id:modifier._id}, modifier.modifier);
            return modifier._id;
        } else {
            throw new Meteor.Error('product.update.accessDenied',
                'Cannot update product. No rights');
        }
    }
});
