
var productsInList, itemsContainer;
var productsMarkup = `
  <div class="row">
    <div class="column">
      <p id="dish-name">{{dishName}}</p>
      {{#products}}
        <div id="{{epi}}" class="product clearfix">
          <div class="float-left">
            <p class="title">{{dt}}</p>
            <p class="qty">{{#cprops}} {{qtyRecipe}} {{/cprops}}</p>
          </div>
          <div class="float-right">
            <a onClick="onRemove(event)" class="remove" data-product-id="{{empi}}" data-variant-id="{{epi}}">x</a>
          </div>
        </div>
      {{/products}}
    </div>
  </div>
`;

var collectionsMarkup = `
<div class="row">
  <div class="column">
    {{#collections}}
      <div class="product clearfix">
        <div class="float-left">
          <p class="title">{{.}}</p>
        </div>
      </div>
    {{/collections}}
  </div>
</div>

`;

function onRemove(e){
  var epi = e.target.getAttribute("data-variant-id");
  for (var i = 0; i < productsInList.length; i++) {
    if(productsInList[i].epi == epi){
      break;
    }
  }
  productsInList.splice(i, 1);
  document.getElementById(epi).remove();
}
function swymCallbackFn(){
  productsInList = articleInfo.products;
  itemsContainer = document.getElementById("items-container");
  var addToListBtn = document.getElementById("add-to-list");
  var shopBtn = document.getElementById("shop-on-site");

  window._swat.fetchWishlistWRTHashtag(function(products){
    if(products.length > 0){
      addToListBtn.innerHTML = "Added to list";
      addToListBtn.style["pointer-events"] = "none";
    }
  }, articleInfo.dishName);

  renderDishProducts();

  addToListBtn.addEventListener("click", function(e){
    var btn = e.target;
    btn.innerHTML = "Adding to list..";
    productsInList.forEach(function(p){
      var eventMap = JSON.parse(JSON.stringify(p));
      eventMap.hashtags = [articleInfo.dishName];
      _swat.addToWishList(eventMap, function(a){
        console.log(a);
      });
    });
    btn.innerHTML = "Added";
    btn.style["pointer-events"] = "none";
    btn.style.opacity = 0.7;
  });

  shopBtn.addEventListener("click", function(e){
    window.open(homeDomain, '_blank');
  });
}
if(!window.SwymCallbacks){
 window.SwymCallbacks = [];
}
window.SwymCallbacks.push(swymCallbackFn);

function closeModal(e){
  document.getElementById("modal-container").style.display = "none";
}

function renderDishProducts(event){
  if(event) event.preventDefault();
  if(articleInfo){
    if(articleInfo.dishName && articleInfo.products){
      var productInList = articleInfo.products;
      var markup = SwymUtils.renderTemplateString(productsMarkup, {dishName: articleInfo.dishName, products: articleInfo.products});
      itemsContainer.innerHTML = markup;
    }
  }
}

function renderUserLists(event){
  if(event) event.preventDefault();
  _swat.getAllCollections(function(collectionMap){
    var collectionNames = [];
    for(var collectionName in collectionMap){
      collectionNames.push(collectionName);
    }
    var markup = SwymUtils.renderTemplateString(collectionsMarkup, {collections: collectionNames});
    itemsContainer.innerHTML = markup;
  });
}

// window.addEventListener('storage', function(event){
//   console.log(event);
//   if(event.key == "open-modal" && event.newValue == "true"){
//     document.getElementById("modal-container").style.display = "block";
//   }
//   if(event.key == "open-modal" && event.newValue == "false"){
//     document.getElementById("modal-container").style.display = "none";
//   }
// });
