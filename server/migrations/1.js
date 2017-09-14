Migrations.add({
    version: 1,
    up: function () {
      for (var i = 0; i < 9; i++) {
        Product.insert({
          name:`Product ${i}`,
          description: `Product ${i} description`,
          price: 100 + i * 2
        })
      }
    }
});
