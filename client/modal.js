/* global TrelloPowerUp */
/* global ApexCharts */
/* global Tabulator */
/* globals OSREC */
var common = require('./common.js');
var Tabulator = require('tabulator-tables');
var ApexCharts = require('apexcharts');
var OSREC = require('currencyformatter.js');
var moment = require('moment');

var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var text = t.arg('text');

document.addEventListener("RenderView", function(e) {
  renderview();   
});


var renderview = async function(){
  // this function we be called once on initial load
  // and then called each time something changes that
  // you might want to react to, such as new data being
  // stored with t.set()
    return t.cards('all')
    .then(async function (cards) {
      
      var event = new CustomEvent("UpdateToastStatus", {
        detail: { status: "update", text: "Getting latest currencies..." }
      });

      // Dispatch/Trigger/Fire the event
      document.dispatchEvent(event);           
      
      var event = new CustomEvent("UpdateToastStatus", {
        detail: { status: "update", text: "Calculating all the trips..." }
      });

      // Dispatch/Trigger/Fire the event
      document.dispatchEvent(event);   
      var totalBudget = 0;
      var budgets = [];
      var budgetField = /^budget\[([-\w\s]+)\]/i;
      for (var card in cards) {
        // console.log("card desc: " + JSON.stringify(cards[card],null,2));
        // console.log("card desc: " + cards[card].desc);
        var lines = cards[card].desc.split('\n');
        var currency = 'USD';
        for (var linetext in lines) {
          // console.log('line: ' + linetext);
          var semicolonpos = lines[linetext].indexOf(':');
          var categoryStr = (semicolonpos == -1) ? '' : lines[linetext].substr(0,semicolonpos);
          var categoryMatchStr = categoryStr.toLowerCase();
          if (categoryMatchStr == 'time' || categoryMatchStr == 'location') {
            continue;
          }
          var match = budgetField.exec(categoryStr);
          if (match != null || categoryMatchStr.startsWith('budget')) {
            var budgetCategory = 'Budget';
            if (match != null && match.length > 1) {
              budgetCategory = match[1];
            }
            try {
              var amtStr = lines[linetext].substr(semicolonpos+1,lines[linetext].length);
              //console.log("Amount Str:" + amtStr);
              // console.log('Found currency string: ' + OSREC.parse(amtStr, { currency: currency }));
              var sectionAmount = OSREC.parse(amtStr, { currency: currency });
              if (budgetCategory in budgets) {
                budgets[budgetCategory] += sectionAmount;
              } else {
                budgets[budgetCategory] = sectionAmount;
              }           
              totalBudget += sectionAmount;
            } catch (err) {
              console.log('Could not parse this as currency: ' + amtStr);
            }            
          } else if (categoryStr == '' && lines[linetext].trim().length > 0) {
            break;
          }
        }        
      }
      
      var listArr = await t.lists('all');
      
      // loop thru listArr titles to parse for dates
      // var a = new Date('01/12/2016');
      // if (aa == "Invalid Date") {
      // means its not a day format
      // should also support format: Day ##
      // https://momentjs.com/guides/#/parsing/
      
      // console.log(JSON.stringify(cards, null, 2));
      document.getElementById('cardCount').textContent = cards.length;
      document.getElementById('listCount').textContent = listArr.length;
      document.getElementById('costCount').textContent = currency + ' ' + common.abbreviateMoney(totalBudget);
      
      console.log("Budget keys:" + Object.keys(budgets));
      console.log("Budget values:" + Object.values(budgets));
      
        var options = {
            chart: {
                // width: 380,
                height: 200,
                type: 'pie',
            },
            labels: Object.keys(budgets),
            series: Object.values(budgets),
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }

        var chart = new ApexCharts(
            document.querySelector("#chart"),
            options
        );

        chart.render();
      
        var currencyFormat = OSREC.getFormatDetails({ currency : 'USD'});
      
        // in future, add source and default currency columns and convert with them dynamically
        var table = new Tabulator("#budget-table", {
            // height:"211px",
            layout:"fitColumns",
            columns:[
                {title:"Category", field:"name", width:200},
                {title:"Amount ( USD )", formatter:"money", formatterParams:{decimal:currencyFormat.decimal,thousand:currencyFormat.group,precision:0},field:"amount", sorter:"number", bottomCalc:"sum", bottomCalcParams:{precision:0}, bottomCalcFormatter: "money", bottomCalcFormatterParams:{decimal:currencyFormat.decimal,thousand:currencyFormat.group,precision:0}},
                {title:"Currency", field:"currency", width:50},
            ],
        });
      
        var budgetKeys = Object.keys(budgets);
        var budgetValues = Object.values(budgets);
        var arrBudgets = [];
        // console.log("Budgets length: " + budgets.length);
        for (var j=0;j<budgetKeys.length;j++) {
          var obj = new Object();
          obj.id = j+1;
          obj.name = budgetKeys[j];
          obj.amount = budgetValues[j];
          obj.currency = currencyFormat.symbol;
          // console.log("loop :" + JSON.stringify(obj));
          arrBudgets.push(obj);
        }

        table.setData(JSON.stringify(arrBudgets));    
      
        // Create the event
        var event = new CustomEvent("ResetDisplayBudget", { "detail": "Example of an event" });

        // Dispatch/Trigger/Fire the event
        document.dispatchEvent(event);        

    });  

}

// t.render(renderview());

