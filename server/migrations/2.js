Migrations.add({
    version: 2,
    up: function () {
      for (var i = 0; i < 4; i++) {
        Customer.insert({
          name: `Customer ${i}`,
          address: {
            line1: `Khreshchatyk ${i}`,
            city: `Kyiv`,
            country: `Ukraine`
          }
        })
      }
    }
});
