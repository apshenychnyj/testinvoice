import { Meteor } from 'meteor/meteor';
import '../imports/server/index';

Meteor.startup(() => {
  // code to run on server at startup
  const adminUsers = ['apshenychnyj@gmail.com', 'testUser@test.com'];
  for (let i = 0; i < adminUsers.length; i += 1) {
    const u = Meteor.users.findOne({ 'emails.address': adminUsers[i] });
    if (u) {
      Roles.addUsersToRoles(u._id, ['admin'], Roles.GLOBAL_GROUP);
    } else {
      const newUser = Accounts.createUser({
        email: adminUsers[i],
        password: 'testTask!1234',
      });
      Roles.addUsersToRoles(newUser, ['admin'], Roles.GLOBAL_GROUP);
    }
  }
});
