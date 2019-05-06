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

router.get('/', function(req, res, next) {
  var pid = req.query.pid;
  var articleHandle = req.query.articleHandle;
  if(!articlesToProducts.hasOwnProperty(articleHandle) || !provisionedPids.hasOwnProperty(pid)){
    res.status(404).send('Not found');
  } else {
    var articleInfo = articlesToProducts[articleHandle], domain = provisionedPids[pid].domain;
    request('http://localhost:3000/stylesheets/style.css', function (error, response, cssContent) {
      res.render('index', {pid: pid, domain: domain, articleInfo: JSON.stringify(articleInfo), csscontent: cssContent});
    });
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
