// this file will be injected in the main site and will bring back the context collected across mediums
// it will also throw in context that the other mediums can then surface
function initListener(){
  console.log("initialised");
  var iframeHost = window.location.hostname;
  var homeDomain = "https://sams-grocery-store.myshopify.com";

  window.addEventListener("message", receiveMessage, false);

  function receiveMessage(event) {
    console.log(event);
    if (event.origin !== homeDomain) return;

    var data = event.data;
    console.log(event);
    if(data.type == "update-context"){
      var diff = [];
      var sentProducts = data.homeProducts;
      /* update home */
      _swat.fetch(function(products){
        products.forEach(function(p){
          var foundProduct = sentProducts.filter(function(sentP){
            return sentP.epi == p.epi && sentP.et == p.et;
          });
          if(foundProduct.length == 0){
            diff.push(p);
          }
        });
        event.source.postMessage({type: "update-context", products: diff}, event.origin);
      });
    }
  }
}

initListener();
