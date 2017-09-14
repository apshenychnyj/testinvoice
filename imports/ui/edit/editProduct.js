import './editProduct.html';

Template.editProduct.helpers({
  panelTitle(){
    return Router.current().params.productId ? "Edit product" : "Create product";
  },
  type(){
    return Router.current().params.productId ? "method-update" : "method";
  },
  doc(){
    return Router.current().params.productId ? Product.findOne({_id:Router.current().params.productId}) : {}
  },
  productMethod(){
    return Router.current().params.productId ? "productUpdate" : "productInsert";
  }
});


AutoForm.hooks({
  productEdit: {
    onSuccess(error, result) {
      Router.go('allProducts');
    },
  },
});
