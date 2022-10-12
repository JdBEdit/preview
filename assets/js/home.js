/*! Copyright 2017 - 2021 JdBEdit. All rights reserved. */

$(document).ready(function(){
  const wetrafa_domaine = "wetrafa.xyz";
  let errorTimeout;

  /**
   * Extract gist id from the given URL.
   * @private
   * @param {string} str URL to extract gist id from.
   * @returns {string} Gist id
   */
  function getGistId (str) {
    str = str.trim();
    if (!jdb.isUrl(str)) {
      return str; // Not a URL. Considered as a gist id.
    } else if (str.indexOf("//gist.github.com/") > -1) {
      str = str.split("/").pop().split("?")[0];
    } else if (str.indexOf("//gist.githubusercontent.com/") > -1 ||
      str.indexOf("//cdn.rawgit.com/") > -1 || str.indexOf("//rawgit.com/") > -1
      //! Remove rawgit support on the end of 2022.
    ) {
      str = str.split("/")[4];
    } else if (str.indexOf(`//code.${wetrafa_domaine}/preview/`) > -1) {
      str = str.split("/")[4];
    } else if (
      str.indexOf(`//code.${wetrafa_domaine}/`) > -1 ||
      str.indexOf(`//codewith.${wetrafa_domaine}/`) > -1 ||
      str.indexOf(`//www.code.${wetrafa_domaine}/`) > -1 ||
      str.indexOf("//jdbedit.netlify.com/") > -1
    ) {
      str = jdb.getUrlParam("gistId", str) || jdb.getUrlParam("template", str);
    } else if (str.indexOf(`//preview.codewith.${wetrafa_domaine}/`) > -1) {
      if (str.indexOf("/file/") > -1) {
        str = str.split("/")[4];
      } else if (str.indexOf("id=") > -1) {
        str = jdb.getUrlParam("id", str);
      } else {  str = ""; }
    } else { str = ""; }

    return (str && str.length > 0) ? str : -1;
  }

  /**
   * Add user settings in the URL.
   * @private
   */
  function setUserChoicesInUrl() {
    let $input = $("#update-id-input");
    let val = $input.val();

    // If no file ID or URL provided.
    if (val === "") {
      showError();
      $input.addClass("jdb-border-red").delay(1e3).queue(function(){
        $(this).removeClass("jdb-border-red").dequeue();
      });
      return;
    }

    const gistId = getGistId(val);
    const render_all = $("#setting-preview-type").val();
    const theme = $("#setting-theme").val();
    const newURL_path = "/?id=" + gistId +
      (render_all === "render" ? "" : "&render=false") +
      (theme !== "" ? ("&theme=" + theme) : "");

    if (gistId < 0) {
      showError();
    } else {
      // All params seem to be ok.
      window.open(newURL_path, "_blank");
    }
  }

  /**
   * Show the given error message.
   * @private
   * @param {string} [msg] Error message
   */
  function showError(msg) {
    if (!msg) msg = "Veuillez fournir un ID de fichier valide.";
    $("#jdb-error-msg").text(msg).slideDown();
    errorTimeout = setTimeout(() => {
      clearTimeout(errorTimeout);
      errorTimeout = null;
    }, 5000);
  }

  /**
   * Load Google Ads.
   * @private
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

  let themeOptGroup = `<optgroup id="dark-theme" label="Thèmes sombres">`;
  themeOptGroup += `<option value="" selected>Sélectionner un thème</option>`;
  for (let i = 0; i < hljs_all_themes.dark.length; i++) {
    themeOptGroup += `<option value="${hljs_all_themes.dark[i].replace(/\s/g, "-").toLowerCase()}">
      ${hljs_all_themes.dark[i]}</option>`;
  }
  themeOptGroup += `</optgroup>`;
  $("#setting-theme").append(themeOptGroup);

  themeOptGroup = `<optgroup id="light-theme" label="Thèmes clairs">`;
  for (let i = 0; i < hljs_all_themes.light.length; i++) {
    themeOptGroup += `<option value="${hljs_all_themes.light[i].replace(/\s/g, "-").toLowerCase()}">
      ${hljs_all_themes.light[i]}</option>`;
  }
  themeOptGroup += `</optgroup>`;
  $("#setting-theme").append(themeOptGroup);

  $("#update-id-btn").click(function(){
    $(this).removeClass("jdb-border-bottom").addClass("jdb-border-top").delay(234).queue(function(){
      $(this).removeClass("jdb-border-top").addClass("jdb-border-bottom").dequeue();
    });
    setUserChoicesInUrl();
  });

  $("#update-id-input").on("keydown", event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      setUserChoicesInUrl();
    }

    if (!errorTimeout && $("#jdb-error-msg").is(":visible")) {
      $("#jdb-error-msg").slideUp();
    }
  });

  // Load advertissement from Google adsense.
  // if (window.location.hostname === "preview.codewith." + wetrafa_domaine) loadADS();
});
