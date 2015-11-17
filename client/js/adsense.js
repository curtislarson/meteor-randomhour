Adsense = {};

Adsense.addTopBarCode = function() {
  $.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", function() {
    var ads, adsbygoogle;
    ads = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-0183306563861637" data-ad-slot="7489052424" data-ad-format="auto"></ins>';
    $('.adsense-top-row').html(ads);
    return (adsbygoogle = window.adsbygoogle || []).push({});
  });
}

Adsense.addSidebarCode = function() {
  $.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", function() {
    var ads, adsbygoogle;
    ads = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-0183306563861637" data-ad-slot="5277289225" data-ad-format="auto"></ins>';
    $('.adsense-side-bar-left').html(ads);
    return (adsbygoogle = window.adsbygoogle || []).push({});
  });

  $.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", function() {
    var ads, adsbygoogle;
    ads = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-0183306563861637" data-ad-slot="9707488825" data-ad-format="auto"></ins>';
    $('.adsense-side-bar-right').html(ads);
    return (adsbygoogle = window.adsbygoogle || []).push({});
  });
}