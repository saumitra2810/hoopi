
var productsInList, itemsContainer;
var productsMarkup = `
  <div class="row">
    <div class="column">
      {{#products}}
        <div id="{{epi}}" class="product clearfix">
          <div class="float-left">
            <p class="title"><a target="_blank" href="{{du}}">{{dt}}</a> {{#cprops}} {{qtyRecipe}} {{/cprops}}</p>
            <p class=""></p>
          </div>
          <div class="float-right">
            <a href="#" onClick="onRemove(event)" class="remove" data-product-id="{{empi}}" data-variant-id="{{epi}}">x</a>
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

// var dishProductsMenuItem = document.getElementById("dish-products-menu-item");
// var userListsMenuItem = document.getElementById("user-lists-menu-item");
var dishName = document.getElementById("dish-name");

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
      addToListBtn.innerHTML = "Added to your list";
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
  // SwymUtils.addClass(dishProductsMenuItem, "active");
  // SwymUtils.removeClass(userListsMenuItem, "active");
  if(articleInfo){

    if(articleInfo.dishName && articleInfo.products){
      dishName.innerHTML = articleInfo.dishName;
      var productInList = articleInfo.products;
      var markup = SwymUtils.renderTemplateString(productsMarkup, {dishName: articleInfo.dishName, products: articleInfo.products});
      itemsContainer.innerHTML = markup;
    }
  }
}

function renderUserLists(event){
  if(event) event.preventDefault();
  // SwymUtils.removeClass(dishProductsMenuItem, "active");
  // SwymUtils.addClass(userListsMenuItem, "active");
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
