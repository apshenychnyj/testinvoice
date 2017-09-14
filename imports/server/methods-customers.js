import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

export const customerInsert = new ValidatedMethod({
  name: 'customerInsert',
  validate: CustomerSchema.validator(),
  run(insertDoc){
      if(this.userId && Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)){
          return Customer.insert(insertDoc);
      } else {
          throw new Meteor.Error('customer.insert.accessDenied',
              'Cannot add customer. No rights');
      }
  }
});

export const customerUpdate = new ValidatedMethod({
    name: 'customerUpdate',
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
            Customer.update({_id:modifier._id}, modifier.modifier);
            return modifier._id;
        } else {
            throw new Meteor.Error('customer.update.accessDenied',
                'Cannot update customer. No rights');
        }
    }
});
