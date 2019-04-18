// this file will be injected in the main site and will bring back the context collected across mediums
// it will also throw in context that the other mediums can then surface
function initListener(){
  console.log("initialised");
  var iframeHost = window.location.hostname;
  var homeDomain = "https://sams-furniture-store.myshopify.com";

  /* start cookie utils */

  var createCookie_ = function (name, value, domain) {
      var date = new Date();
      date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
      var expires = '; expires=' + date.toGMTString();
      document.cookie = name + '=' + value + expires + '; path=/' + (domain ? (';domain=.' + domain) : '');
  };

  var readCookie_ = function (name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
  };

  /* end cookie utils */

  window.addEventListener("message", receiveMessage, false);

  function receiveMessage(event) {
    console.log(event);
    if (event.origin !== homeDomain) return;

    var data = event.data;
    console.log(event);
    if(data.type == "set-user"){
      var regid = data["swym-regid"];
      var sessionid = data["swym-sessionid"];

      var regidInCookie = readCookie_("swym-regid");
      var sessionidInCookie = readCookie_("swym-sessionid");

      if(!regidInCookie || !sessionidInCookie) {
        createCookie_("swym-regid", regid, iframeHost);
        createCookie_("swym-sessionid", sessionid, iframeHost);
      }
    }
  }
}

initListener();
