
var cc = require('currency-codes');


var abbreviateMoney = function(money) {
  var endGrouping = '';
  var newMoney = money;
  if (money > 10000000000000) {
    newMoney = money/1000000000;
    endGrouping = 't';
  } else if (money > 1000000000) {
    newMoney = money/1000000000;
    endGrouping = 'b';
  } else if (money > 1000000) {
    newMoney = money/1000000;
    endGrouping = 'm';
  } else if (money > 1000) {
    newMoney = money/1000;
    endGrouping = 'k';
  } 
  return newMoney.toFixed(1) + endGrouping;
}



module.exports.abbreviateMoney = abbreviateMoney;

