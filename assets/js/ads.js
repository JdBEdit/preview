/**
 * Load Google Ads.
 * @private
 */
export default function loadADS() {
  $.ajax({
    async: true, method: "GET", dataType: "script",
    url: "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  }).done(function(){
    setTimeout(function(){
      $(".app").append(
        $("<hr>").addClass("jdb-hr")
      ).append(function(){
        return $("<div>", {
          class: "jdb-padding-sm",
          id: "jdb-gad",
        }).append(
          $("<ins>", {
            class: "adsbygoogle",
            "data-ad-format": "auto",
            "data-ad-slot": "1840197803",
            "data-full-width-responsive": "true",
            "data-ad-client": "ca-pub-9293032318237031"
          }).css({
            height: "90px",
            display: "block",
            // width: "234px"
          })
        );
      });

      if (typeof adsbygoogle.requestNonPersonalizedAds === "undefined") {
        adsbygoogle.requestNonPersonalizedAds = 1;
      }
      // Push an advertissement.
      (adsbygoogle = window.adsbygoogle || []).push({});
    }, 1000);
  });
}
