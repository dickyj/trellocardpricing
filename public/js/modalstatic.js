/* globals renderview */
/* globals iziToast */

var isInitialized = false;

// get home Currency
const urlParams = new URLSearchParams(window.location.search);
const homeParam = urlParams.get('homeCurrency');
document.getElementById('homeCurrencytxt').textContent  = homeParam;

// https://stackoverflow.com/questions/51966474/immediately-execute-dynamically-loaded-js-script
// https://www.html5rocks.com/en/tutorials/speed/script-loading/
// https://medium.com/reloading/javascript-start-up-performance-69200f43b201

// progress
// https://codeseven.github.io/toastr/demo.html
// http://izitoast.marcelodolza.com//
// https://loading.io/progress/
document.addEventListener("UpdateToastStatus", function (e) {
  if (e.detail.status == 'start' || e.detail.status  == 'update') {
    if (e.detail.status == 'update') {
      iziToast.destroy();     
    }
    var statusText = e.detail.text;
    
    iziToast.show({
        id: null, 
        class: '',
        title: 'Progress',
        titleColor: '',
        titleSize: '',
        titleLineHeight: '',
        message: statusText,
        messageColor: '',
        messageSize: '',
        messageLineHeight: '',
        backgroundColor: '',
        theme: 'light', // dark
        color: '', // blue, red, green, yellow
        icon: '',
        iconText: '',
        iconColor: '',
        iconUrl: null,
        image: '',
        imageWidth: 50,
        maxWidth: null,
        zindex: null,
        layout: 1,
        balloon: false,
        close: true,
        closeOnEscape: false,
        closeOnClick: false,
        displayMode: 0, // once, replace
        position: 'center', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
        target: '',
        targetFirst: true,
        timeout: false,
        rtl: false,
        animateInside: true,
        drag: true,
        pauseOnHover: true,
        resetOnHover: false,
        progressBar: true,
        progressBarColor: '',
        progressBarEasing: 'linear',
        overlay: false,
        overlayClose: false,
        overlayColor: 'rgba(0, 0, 0, 0.6)',
        transitionIn: 'fadeInUp',
        transitionOut: 'fadeOut',
        transitionInMobile: 'fadeInUp',
        transitionOutMobile: 'fadeOutDown',
        buttons: {},
        inputs: {},
        onOpening: function () {},
        onOpened: function () {},
        onClosing: function () {},
        onClosed: function () {}
    });          
    
  } else if (e.detail.status  == 'end') {
    iziToast.destroy();
  } 
});


document.addEventListener("ResetDisplayBudget", function(e) {
  // console.log(e.detail); // Prints "Example of an event"
    // document.getElementsByClassName("status")[0].innerHTML = "Done";
    // Create the event
    var event = new CustomEvent("UpdateToastStatus", {
    detail: { status: "end" }
  });

    // Dispatch/Trigger/Fire the event
    document.dispatchEvent(event);       
  
    var btn = document.getElementsByClassName("displayBudgetBtn")[0];
    btn.disabled = false;      
});

var onBtnCalcClick = function (thisBtn) {
  thisBtn.disabled = true;
  // render progress indicator
  var event = new CustomEvent("UpdateToastStatus", {
    detail: { status: "start", text: "Loading Script, Please wait..." }
  });

  // Dispatch/Trigger/Fire the event
  document.dispatchEvent(event);      
  // document.getElementsByClassName("status")[0].innerHTML = "loading script...";
  if (!isInitialized) {
    [
      '/js/modal.js'
    ].forEach(function(src) {
      var script = document.createElement('script');
        script.type='text/javascript';
        script.onload = script.onreadystatechange = function() {
        if ( (!this.readyState ||
                this.readyState === "loaded" || this.readyState === "complete") ) {
          var event = new CustomEvent("RenderView", {
            detail: { status: "start", text: "Loading Script, Please wait..." }
          });

          // Dispatch/Trigger/Fire the event
          document.dispatchEvent(event);  

        }
        // alert("Script loaded and ready");
      };
      script.src = src;
      script.async = false;
      document.body.appendChild(script);    

    });
    isInitialized = true;
  } else {
    // https://stackoverflow.com/questions/14705593/javascript-can-not-call-content-script-js-function
    // https://stackoverflow.com/questions/36154037/how-to-call-a-function-from-injected-script
    var event = new CustomEvent("RenderView", {
      detail: { status: "start", text: "Loading Script, Please wait..." }
    });

    // Dispatch/Trigger/Fire the event
    document.dispatchEvent(event);  
  }
  

};
