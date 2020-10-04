/*! Copyright 2017 - 2020 JdBEdt. All rights reserved. */

$(document).ready(function(){
  var wetrafa_domaine = "wetrafa.xyz";

  /**
   * Extract gist id from the given URL.
   * @private
   * @param {string} str URL
   * @returns {string} Gist id
   */
  function getGistId (str) {
    if (!jdb.isUrl(str)) {
      return str;
    } else if (str.indexOf("//gist.github.com/") > -1) {
      return str.split("/").pop().split("?")[0];
    } else if (str.indexOf("//gist.githubusercontent.com/") > -1) {
      return str.split("/")[4];
    } else if (str.indexOf("//cdn.rawgit.com/") > -1) {
      return str.split("/")[4];
    } else if (str.indexOf("//rawgit.com/") > -1) {
      return str.split("/")[4];
    } else if (str.indexOf("//code." + wetrafa_domaine + "/preview/") > -1) {
      return str.split("/")[4];
    } else if (str.indexOf("//code." + wetrafa_domaine + "/") > -1) {
      return jdb.getUrlParam("gistId", str) || jdb.getUrlParam("template", str);
    } else if (str.indexOf("//codewith." + wetrafa_domaine + "/") > -1) {
      return jdb.getUrlParam("gistId", str);
    } else if (str.indexOf("//www.code." + wetrafa_domaine + "/") > -1) {
      return jdb.getUrlParam("gistId", str);
    } else if (str.indexOf("//jdbedit.netlify.com/") > -1) {
      return jdb.getUrlParam("gistId", str);
    } else if (str.indexOf("//preview.codewith." + wetrafa_domaine + "/") > -1) {
      return jdb.getUrlParam("id", str);
    }
  }

  /**
   * Add user settings in the URL.
   * @private
   * @returns {void}
   */
  function setUserChoicesInUrl() {
    var $input = $("#update-id-input");
    var val = $input.val();

    // If no file ID or URL provided.
    if (val === "") {
      $("#jdb-error-msg").text("Veuillez fournir une ID de fichier.").slideDown();
      $input.addClass("jdb-border-red").delay(1e3).queue(function(){
        $(this).removeClass("jdb-border-red").dequeue();
      });
      return;
    }

    var gistId = getGistId(val);
    var style_md = $("#setting-style-markdown").prop("checked");
    var render_md = $("#setting-render-markdown").prop("checked");
    var render_all = $("#setting-preview-type").val();
    var theme = $("#setting-theme").val();
    var newURL_path = "/?id=" + gistId +
      (style_md ? "&style_md=true" : "") +
      (render_md ? "&exec=true" : "") +
      (render_all === "render" ? "" : "&render=false") +
      (theme !== "" ? ("&theme=" + theme) : "");

    window.open(newURL_path, "_blank");
  }

  /**
   * Load Google Ads.
   * @private
   * @returns {void}
   */
  function loadADS() {
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
              // width: "234px",
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

  $("#update-id-btn").click(function(){
    $(this).removeClass("jdb-border-bottom").addClass("jdb-border-top").delay(234).queue(function(){
      $(this).removeClass("jdb-border-top").addClass("jdb-border-bottom").dequeue();
    });
    setUserChoicesInUrl();
  });

  $("#update-id-input").on("keyup keydown", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      setUserChoicesInUrl();
    }

    if ($("#jdb-error-msg").is(":visible")) $("#jdb-error-msg").slideUp();
  });

  $("#setting-render-markdown").change(function(){
    var render_md = $(this).is(":checked");
    if (render_md) {
      $("#setting-style-markdown").attr("disabled", false);
      $("#setting-theme").val("").attr("disabled", true);
    } else {
      $("#setting-style-markdown").attr("disabled", true);
      $("#setting-theme").attr("disabled", false);
      if ($("#setting-style-markdown").is(":checked")) {
        $("#setting-style-markdown").prop("checked", false);
        $("#setting-theme").val("");
      }
    }
  });

  // Load advertissement from Google adsense.
  // if (window.location.hostname === "preview.codewith." + wetrafa_domaine) loadADS();
});