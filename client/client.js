/* global TrelloPowerUp */

/* globals currency */
/* globals OSREC */
var OSREC = require('currencyformatter.js');
var common = require('./common.js');



var Promise = TrelloPowerUp.Promise;

var WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';
var BLACK_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-black.svg';
var GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';



var onBtnClick = function (t, opts) {
  return t.board('id','name').get('id')
.then(function (data) {
  console.log('Someone clicked the button:' + data);
});
}

var boardButtonCallback = function(t){
  // console.log('board home currency: ' + getTripCurrency(homeCountry));
  var homeCurrency = 'USD';
  return t.popup({
    title: 'Budget Menu',
    items: [
      {
        text: 'Calculate Budget',
        callback: function(t){
          return t.modal({            
            url: './modalstatic.html?homeCurrency=' + homeCurrency, // The URL to load for the iframe
            args: { text: 'Hello' }, // Optional args to access later with t.arg('text') on './modal.html'
            accentColor: '#F2D600', // Optional color for the modal header 
            height: 800, // Initial height for iframe; not used if fullscreen is true
            // fullscreen: true, // Whether the modal should stretch to take up the whole screen
            callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
            title: 'Triprise Analytics', // Optional title for modal header
            // You can add up to 3 action buttons on the modal header - max 1 on the right side.
            actions: [{
              icon: GRAY_ICON,
              url: 'https://google.com', // Opens the URL passed to it.
              alt: 'Leftmost',
              position: 'left',
            }, {
              icon: GRAY_ICON,
              callback: (tr) => t.modal({            
                url: './power-up-onboarding.html',
                height: 500,
                title: 'My Power-Up Overview'
              }),
              alt: 'Right side',
              position: 'right',
            }],
          })
        }
      }
    ]
  });
};

var introButtonCallback = function(t){
    return t.modal({            
      url: './power-up-onboarding.html',
      height: 500,
      title: 'My Power-Up Overview'
    });  
}


window.TrelloPowerUp.initialize({
  'on-enable': function(t, options) {
    // This code will get triggered when a user enables your Power-Up
    return t.modal({            
      url: './power-up-onboarding.html',
      height: 500,
      title: 'My Power-Up Overview'
    });
  },  
  'board-buttons': async function (t, opts) {
    var lists = await t.lists('all');
    return [{
      // we can either provide a button that has a callback function
      icon: {
        dark: WHITE_ICON,
        light: BLACK_ICON
      },
      text: 'Budget',
      callback: boardButtonCallback,
      condition: 'always'
    }, {
      // or we can also have a button that is just a simple url
      // clicking it will open a new tab at the provided url
      icon: {
        dark: WHITE_ICON,
        light: BLACK_ICON
      },
      text: 'Intro',
      callback: introButtonCallback,
      condition: 'always'
    }];
  },
  'card-badges': async function (t, opts) {
    let cardAttachments = opts.attachments; // Trello passes you the attachments on the card

    return t.card('all')
    .then(async function(cardProps) {
      // console.log('We just loaded the card name for fun: ' + JSON.stringify(cardProps, null, 2));
      var cardDesc = cardProps['desc'];
      var cardAmount = -1;
      var cardTime = 'none';

      
      var lines = cardDesc.split('\n');
      var budgetField = /^budget\[([-\w\s]+)\]/;
      var currency = 'USD';
      var currencyValid = true;
      
      // console.log('new currency:' + currency);
      // console.log('We just loaded the card name for fun: ' + lines.length);
      for (var linetext in lines) {
        var semicolonpos = lines[linetext].indexOf(':');
        var categoryStr = (semicolonpos == -1) ? '' : lines[linetext].substr(0,semicolonpos).toLowerCase();
        if (budgetField.exec(categoryStr) != null || categoryStr.startsWith('budget')) {
          try {
            var amtStr = lines[linetext].substr(semicolonpos+1,lines[linetext].length);
            var sectionAmount = OSREC.parse(amtStr, { currency: currency });
            if (cardAmount == -1) {
              cardAmount = 0;
            }
            cardAmount += sectionAmount;            
          } catch (err) {
            console.log('Could not parse this as currency: ' + amtStr);
            currencyValid = false;
          }

        } else if (categoryStr == '' && lines[linetext].trim().length > 0) {
          break;
        }
      }
      
      if (!currencyValid) {
      //  console.log("VALID$$$$: " + (currencyValid ? OSREC.format(cardAmount, { currency: currency }) : 'Unknown' ));
      }
      // save all the parameters for easy access      
      await t.set('card','shared','budget',cardAmount);
      
      var badges = [];
      if (cardAmount != -1) {
        badges.push({
          // dynamic badges can have their function rerun
          // after a set number of seconds defined by refresh.
          // Minimum of 10 seconds.
          dynamic: function(){
            // we could also return a Promise that resolves to
            // this as well if we needed to do something async first
            // currency("$1,234.56").add("890.12")
            // (Math.random() * 100).toFixed(0).toString()
            return {
              text: 'Budget(' + currency + '): ' + (currencyValid ? OSREC.format(cardAmount, { currency: currency }) : 'Unknown' ),
              // icon: './images/icon.svg',
              icon: 'https://cdn.glitch.com/0a178325-3429-4356-9e0e-c6aed80fea14%2Fbaseline-attach_money-24px.svg?1556765031748',
              color: 'blue',
              refresh: 10 // in seconds
            };
          }
        });
      }
      return badges;
    });
  },
  'format-url': function (t, options) {
    // options.url has the url that we are being asked to format
    // in our response we can include an icon as well as the replacement text
    console.log('format url called: ' + options.url);
    return {
      icon: GRAY_ICON, // don't use a colored icon here
      text: '👉 ' + options.url + ' 👈' 
    };
    
    // if we don't actually have any valuable information about the url
    // we can let Trello know like so:
    // throw t.NotHandled();
  },
'card-from-url': async function (t, options) {
    // options.url has the url in question
    // if we know cool things about that url we can give Trello a name and desc
    // to use when creating a card. Trello will also automatically add that url
    // as an attachment to the created card
    // As always you can return a Promise that resolves to the card details
    return new Promise(function (resolve) {
      var checkUrl = common.getGoogleMapInfo(options.url);
      var descToDisplay = 'Budget[Category]: 100\nYou may change the category within the budget to other term and it will be automatically summarized';
      if ("place" in checkUrl) {
        resolve({
          name: checkUrl["place"],
          desc: descToDisplay
        });
      } else {
         resolve({
          // name: '💻 ' + options.url + ' 🤔',
          desc: descToDisplay
        });       
      }
    });  
    
    // if we don't actually have any valuable information about the url
    // we can let Trello know like so:
    // throw t.NotHandled();
  } ,
  'card-back-section': async function(t, options){
    
    return {
      title: 'Place Information',
      icon: GRAY_ICON, // Must be a gray icon, colored icons not allowed.
      content: {
        type: 'iframe',
        // url: t.signUrl('./cardback.html'),
        url: t.signUrl('./cardplace.html'),
        height: 200 // Max height is 500
      }
    };
  }  
});