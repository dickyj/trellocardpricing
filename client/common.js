
var cc = require('currency-codes');


function getHost(href) {
  var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
  return match[2];
}

function isGoogleMap(href) {
  var mapSubStr = "/maps/place/";
  if (href.indexOf(mapSubStr) != -1) {
    var host = getHost(href);
    if (host.startsWith("www.google.")) {
      return true;
    }
  }
  return false;
}

var getGoogleMapInfo = function (url) {
  if (isGoogleMap(url)) {
    // var URL =  "https://www.google.com/maps/place/Restoran+Tong+Sheng/@2.1868667,102.2541963,17z/data=!4m13!1m7!3m6!1s0x0:0x0!2zMsKwMTEnMTEuNiJOIDEwMsKwMTUnMDUuMSJF!3b1!8m2!3d2.1865665!4d102.2514175!3m4!1s0x31d1ee33a42c9bfd:0x30cd338de7a65cfd!8m2!3d2.1865664!4d102.2536062";

    var placeStr = url.substring(url.indexOf("/maps/place/")+"/maps/place/".length,url.length);
    placeStr = decodeURIComponent(placeStr.substring(0,placeStr.indexOf('/')).replace(/\+/g, " "));
    // console.log(placeStr);

    var retVal = {};
    retVal["place"] = placeStr;
    return retVal;    

  } 
  // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
  return {};    

}

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
module.exports.getGoogleMapInfo = getGoogleMapInfo;
