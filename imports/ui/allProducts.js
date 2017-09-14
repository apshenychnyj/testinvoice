import './allProducts.html'

Template.products.helpers({
  products(){
    return Product.find();
  }
});
