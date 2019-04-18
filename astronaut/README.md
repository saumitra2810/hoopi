## HOW TO USE

1. On the customer site add the following -

```
<iframe id="context" src = "https://02e39363.ngrok.io/siteinject" >
       Sorry your browser does not support inline frames.
 </iframe>

```

2. Then post message to the embed domain from the console as below -

```
var contentWindow = document.getElementById("context").contentWindow
contentWindow.postMessage({type: "set-user", "swym-regid": _swat.storage.get(_swat.key.REGID), "swym-sessionid": _swat.storage.get(_swat.key.SESSIONID)}, "https://02e39363.ngrok.io")

```

3. Now all you need to do is create the iframe for your embedding. This iframe can go on your Shopify blog, Medium blog, Wordpress blog or even your Kickstarter campaign.

```
<iframe  src="https://02e39363.ngrok.io?pid=oQtcz5u8vgt9%2BgDMUPdJqE91OFWbmUZIGITSoS0y03A%3D" ></iframe>

```
If you have wishlist products on the parent site, this URL will start showing an AMP carousel that has those products.
