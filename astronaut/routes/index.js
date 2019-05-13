var express = require('express');
var fs = require('fs');
var router = express.Router();
var request = require('request');

var articlesToProducts = JSON.parse(fs.readFileSync('public/articlesToProducts.json', 'utf8'));
var provisionedPids = JSON.parse(fs.readFileSync('public/provisionedPids.json', 'utf8'));

/* GET home page. */
// router.get('/', function(req, res, next) {
//   var pid = req.query.pid;
//   console.log(pid);
//   var cookies = req.cookies;
//   request('http://localhost:3000/stylesheets/style.css', function (error, response, cssContent) {
//     if (error) console.log(error);
//     var regid = cookies["swym-regid"];
//     var sessionid = cookies["swym-sessionid"];
//     request.post({url: storeEndpoint + "fetchWishlist?pid=" + encodeURIComponent(pid), form: {regid: regid, sessionid: sessionid, days: 30}}, function(err, httpResponse, body){
//       res.render('index', { title: 'Express', content: JSON.parse(body), csscontent: cssContent  });
//     });
//   });
// });

// router.get('/', function(req, res, next) {
//   request('http://localhost:3000/stylesheets/style.css', function (error, response, cssContent) {
//     res.render('index', {csscontent: cssContent});
//   });
// });

// url = request.query_params.get('url', '')
//         max_width = request.query_params.get('maxwidth', 0)
//         max_height = request.query_params.get('maxheight', 0)
//         resp_format = request.query_params.get('format', '')
//         referrer = request.query_params.get('referrer', '')


function parseUrl(url){
  if(url.indexOf("?") != -1){
    var query = url.split("?")[1];
    var params = new URLSearchParams(query);
    return params;
  } else {
    return -1;
  }
}

function getPidFromUrl(url){
  var params = parseUrl(url);
  if(params != -1){
    return params.get("pid");
  } else {
    return -1;
  }
}

function getArticleHandleFromUrl(url){
  var params = parseUrl(url);
  if(params != -1){
    return params.get("articleHandle");
  } else {
    return -1;
  }
}

function buildOembedResponse(url, maxWidth, maxHeight){
  var response = {
    "version":"1.0",
    "type":"rich",
    "html":"<iframe width=\"" + maxWidth + "\" height=\"" + maxHeight + "\" src=\"" + url + "\" frameborder=\"0\" ><\/iframe>",
    "width": maxWidth,
    "height": maxHeight,
    "author_name":"Arvind Krishnan",
    "provider_name":"Swym.it",
    "provider_url":"https:\/\/swym.it\/",
    "title":"Welcome!"
  };
  return response;
}

router.get('/', function(req, res, next) {
  var format = req.query.format;
  var url = req.query.url;
  var maxWidth = req.query.maxwidth;
  var maxHeight = req.query.maxheight;

  if(format != "json" || !maxWidth || !maxHeight || maxWidth < 300 || maxHeight < 400){
    res.status(501).send({});
  } else{
    var pid = getPidFromUrl(url);
    var articleHandle = getArticleHandleFromUrl(url);
    if(pid == -1 || articleHandle == -1){
      res.status(404).send({});
    } else {
      if(!articlesToProducts.hasOwnProperty(articleHandle) || !provisionedPids.hasOwnProperty(pid)){
        res.status(404).send({});
      } else {
        if(maxWidth > 700) {
          maxWidth = 700;
        }
        if(maxHeight > 500) {
          maxHeight = 500;
        }
        var response = buildOembedResponse(url, maxWidth, maxHeight);
        res.status(200).send(response);
      }
    }
  }
  // <iframe id="shopping-list"
  //     title="Create shopping list widget"
  //     width="400"
  //     height="500"
  //     frameBorder="0"
  //     src="https://embed.swymrelay.com?pid=XVQypgMBP3xwA1tOkBm7xR6K1%2BSpWEU9hs0WnOpggsU%3D&articleHandle=tropical-fruit-salad">
  // </iframe>

});

router.get('/shopping-lists', function(req, res, next) {
  var pid = req.query.pid;
  var articleHandle = req.query.articleHandle;
  if(!articlesToProducts.hasOwnProperty(articleHandle) || !provisionedPids.hasOwnProperty(pid)){
    res.status(404).send({});
  } else {
    var articleInfo = articlesToProducts[articleHandle], domain = provisionedPids[pid].domain;
    res.render('index', {pid: pid, domain: domain, articleInfo: JSON.stringify(articleInfo)});
  }
});

router.get('/siteinject', function(req, res, next) {
  var pid = req.query.pid;
  if(!provisionedPids.hasOwnProperty(pid)){
    res.status(404).send('Not found');
  } else {
    var domain = provisionedPids[pid].domain;
    res.render('siteinject', {pid: pid, domain: domain});
  }
});

module.exports = router;





// class OEmbed(APIView):
//     def get(self, request):
//         # The second param passed to the .get() method is the default value, which
//         # is returned if the specified key (first param) isn't found in the dictionary.
//         url = request.query_params.get('url', '')
//         max_width = request.query_params.get('maxwidth', 0)
//         max_height = request.query_params.get('maxheight', 0)
//         resp_format = request.query_params.get('format', '')
//         referrer = request.query_params.get('referrer', '')
//
//         if resp_format and not resp_format == 'json':
//             return Response(data={}, status=501)
//
//         if max_width < 280:
//             return Response(data={}, status=501)
//
//         if max_height < 825:
//             return Response(data={}, status=501)
//
//         try:
//             thread_id = utils.get_thread_id_from_url(url)
//         except ObjectDoesNotExist:
//             return Response(data={}, status=404)
//
//         try:
//             thread = thread_service.get_thread_from_thread_id(request, thread_id)
//         except InvalidPermissionError:
//             return Response(data={}, status=401)
//
//         width = max_width if (max_width and max_width <= 700) else 700
//         height = 825
//
//         resp = thread_service.build_oembed_response(thread, width, height, referrer)
//         return Response(data=resp, status=status.HTTP_200_OK)
//
