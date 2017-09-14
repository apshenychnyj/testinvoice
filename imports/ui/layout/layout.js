import './layout.html';
import './loader.html';

accounting.settings = {
	currency: {
		symbol : "$",   // default currency symbol is '$'
		format: "%s %v", // controls output: %s = symbol, %v = value/number (can be object: see below)
		decimal : ".",  // decimal point separator
		thousand: ",",  // thousands separator
		precision : 2   // decimal places
	},
	number: {
		precision : 0,  // default precision on numbers is 0
		thousand: ",",
		decimal : "."
	}
}
Template.registerHelper('toFixed', function(arg){
  return accounting.formatMoney(arg);
});

Template.registerHelper('fullDate', function(arg){
  return moment(arg).format('DD/MM/YYYY');
})

Template.registerHelper('global', ( string ) => {
	obj = {
		companyName	: "Test Main Company",
		phone				: "+3000-3399-00",
		email				: "testCompany@test.com",
		address     : "Test street 12, Kyiv, Ukraine"
	}
	return obj[string];
});

Template.leftMenu.events({
  "click .logout"(e,t){
    e.preventDefault();
    Meteor.logout();
  }
});
