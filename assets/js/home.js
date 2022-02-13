/*! Copyright 2017 - 2021 JdBEdit. All rights reserved. */

$(document).ready(function(){
  const wetrafa_domaine = "wetrafa.xyz";

  /**
   * Extract gist id from the given URL.
   * @private
   * @param {string} str URL
   * @returns {string} Gist id
   */
  function getGistId (str) {
    str = str.trim();
    if (!jdb.isUrl(str)) {
      return str;
    } else if (str.indexOf("//gist.github.com/") > -1) {
      return str.split("/").pop().split("?")[0];
    } else if (str.indexOf("//gist.githubusercontent.com/") > -1 ||
      str.indexOf("//cdn.rawgit.com/") > -1 || str.indexOf("//rawgit.com/") > -1
    ) {
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
      if (str.indexOf("/file/") > -1) {
        return str.split("/")[4];
      } else if (str.indexOf("id=") > -1) {
        return jdb.getUrlParam("id", str);
      }
    }
  }

  /**
   * Add user settings in the URL.
   * @private
   * @returns {void}
   */
  function setUserChoicesInUrl() {
    let $input = $("#update-id-input");
    let val = $input.val();

    // If no file ID or URL provided.
    if (val === "") {
      $("#jdb-error-msg").text("Veuillez fournir une ID de fichier.").slideDown();
      $input.addClass("jdb-border-red").delay(1e3).queue(function(){
        $(this).removeClass("jdb-border-red").dequeue();
      });
      return;
    }

    const gistId = getGistId(val);
    const style_md = $("#setting-style-markdown").prop("checked");
    const render_md = $("#setting-render-markdown").prop("checked");
    const render_all = $("#setting-preview-type").val();
    const theme = $("#setting-theme").val();
    const newURL_path = "/?id=" + gistId +
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

  $("#update-id-input").on("keyup keydown", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      setUserChoicesInUrl();
    }

    if ($("#jdb-error-msg").is(":visible")) $("#jdb-error-msg").slideUp();
  });

  $("#setting-render-markdown").change(function(){
    if ($(this).is(":checked")) {
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
