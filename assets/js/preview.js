/*! Copyright 2017 - 2021 JdBEdit. All rights reserved. */

$(document).ready(function(){
  var gistId = jdb.getUrlParam("id");
  // If no render param in URL, render_code = true by default.
  var renderCode = jdb.getUrlParam("render") || true;

  /**
   * Load css file for highlight.js.
   * @private
   * @param {requestCallback} [callback] Callback.
   * @returns {void}
   */
  function loadThemeStyle (callback) {
    var hljs_version = "11.3.1"; // 10.2.0
    var hljs_name = "highlight";
    var hljs_user_theme = (jdb.getUrlParam("theme") || "").toLowerCase();
    var path = "//cdnjs.cloudflare.com/ajax/libs/" + hljs_name + ".js/";
    var hljs_themes = hljs_all_themes.dark.concat(hljs_all_themes.light);
    var hljs_all_themes_length = hljs_themes.length;

    if (hljs_user_theme !== null) {
      let i, itheme, validTheme = false;
      for (i = 0; !validTheme && i < hljs_all_themes_length; i++) {
        itheme = hljs_themes[i].replace(/\s/g, "-").toLowerCase();
        if (hljs_user_theme === itheme) {
          hljs_user_theme = itheme;
          validTheme = true;
        }
      }
      if (validTheme) {
        // rewrite file name by prepending the parent folder name.
        for (let i = 0; i < hljs_all_themes.base16.length; i++) {
          if (hljs_user_theme === hljs_all_themes.base16[i]) {
            hljs_user_theme = `base16/${hljs_user_theme}`;
          }
        }
      } else {
        hljs_user_theme = "github-dark";
      }
    } else {
      hljs_user_theme = "github-dark";
    }

    $("<link>", {
      type: "text/css", rel: "stylesheet",
      href: path + hljs_version + "/styles/" + hljs_user_theme + ".min.css"
    }).appendTo("head");

    $.getScript(path + hljs_version + "/" + hljs_name + ".min.js").done(function(){
      if (callback) callback();
    });
  }

  /**
   * Get an existing gist file.
   * @private
   * @param {string} gistId Gist ID.
   */
  function getGist (gistId) {
    $.ajax({
      url: "https:\/\/api.github.com\/gists\/" + gistId,
      type: "GET",
      statusCode: {
        404: function() {
          $(".app").addClass("jdb-unselectable").append(
            $("<style>", {
              type: "text/css",
              text: "body{font-family:Consolas,\"Courier new\",Arial,sans-serif;background:#050c14;line-height:1.5em;cursor:default;font-size:18px;color:#d3d7de;padding:5px}.code-area{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;margin:20px auto;min-width:320px;width:320px;left:50%;top:50%}.code-area>span{display:block}@media screen and (max-width:320px){.code-area{width:95%;margin:auto;padding:5px 5px 5px 10px;font-size:5vw;min-width:auto;line-height:6.5vw}}.home button{outline:0;border:none;color:#fff;cursor:pointer;font-size:17px;overflow:hidden;padding:6px 16px;text-align:center;white-space:nowrap;display:inline-block;vertical-align:middle;text-decoration:none!important;background-color:#050c14;border:1px solid #444;-webkit-transition:background-color .3s,color .15s,box-shadow .3s,opacity .3s,filter .3s;-webkit-transition:background-color .3s,color .15s,opacity .3s,-webkit-box-shadow .3s,-webkit-filter .3s;transition:background-color .3s,color .15s,opacity .3s,-webkit-box-shadow .3s,-webkit-filter .3s;transition:background-color .3s,color .15s,box-shadow .3s,opacity .3s,filter .3s;transition:background-color .3s,color .15s,box-shadow .3s,opacity .3s,filter .3s,-webkit-box-shadow .3s,-webkit-filter .3s}<\/style>"
            })
          ).append("<a class=\"home\" href=\"/home?ref=404\"><button><span style=\"color:green\">&gt;<\/span> Accueil<\/button><\/a><!-- See the license at: https://codepen.io/conmarap/details/mVMvVv/#details-tab-license --><div class=\"code-area jdb-monospace\"><span style=\"color: #777;font-style:italic;\">\n\t// 404 - File not found.<\/span>\n\t<span>\n\t<span style=\"color:#d65562;\">\n\t\tif <\/span>(<span style=\"color:#4ca8ef;\">!<\/span><span style=\"font-style: italic;color:#bdbdbd;\">found<\/span>) {<\/span><span><span style=\"padding-left: 15px;color:#2796ec\"><i style=\"width: 10px;display:inline-block\"><\/i>throw <\/span><span>(<span style=\"color: #a6a61f\">'¯\\_(ツ)_/¯'<\/span>);<\/span>\n<span style=\"display:block\">}<\/span><\/span><\/div>");
        }
      }
    }).done(function(datas) {
      var data = datas.files[Object.keys(datas.files)[0]];
      var lang = data.language.toLowerCase();

      $("head").append(
        $("<meta>", {
          content: data.description,
          name: "description"
        })
      ).append(
        $("<meta>", {
          content: data.description,
          name: "twitter:description"})
      ).append(
        $("<meta>", {
          content: data.description,
          itemprop: "description"})
      ).append(
        $("<meta>", {
          content: data.description,
          property: "og:description"
        })
      ).find("title").text(data.filename.split(".").shift() + " - JdBEdit Preview");

      if (lang === "html") {
        if (renderCode === "false") renderRawPreview(data.content, lang);
        else renderPreview(data.raw_url, lang);
      } else if (lang === "markdown" && jdb.getUrlParam("exec") === "true") {
        $.getScript("/assets/js/marked.js").done(function(){
          var addStyleToMarkDown = jdb.getUrlParam("style_md");
          $(".app").addClass(["max", "preview-markdown"]).html(marked(data.content));
          if (addStyleToMarkDown !== null && addStyleToMarkDown === "true") {
            $("head").append(
              $("<link>", {
                rel: "stylesheet",
                href: "/assets/css/default-md-style.css"
              })
            ).next("body").find(".app").addClass("markdown-body");
          }
        });
      } else {
        renderRawPreview(data.content, lang);
      }
    });
  }

  /**
   * @private
   * @param {string} url
   * @param {string} type Language name.
   * @param {requestCallback} [callback] Callback.
   * @returns {void}
   */
  function renderPreview (url, lang, callback) {
    if (lang === "html" && renderCode === true) {
      var htmlText, iframe = $("<iframe>", {
        id: "iframeResult",
        name: "iframeResult",
        src: /* !!url ? url : */ "about:blank",
        sandbox: "allow-forms allow-scripts allow-same-origin allow-modals allow-popups",
        allow: "midi; geolocation; microphone; camera",
        allowpaymentreqeust: true,
        allowtransparency: true,
        allowfullscreen: true,
        frameborder: 0,
      }).attr({
        width: "100%",
        height: "100%"
      });

      $(".app").css({
        position: "absolute",
        left: 0, right: 0,
        bottom: 0, top: 0,
      }).append(iframe);

      var ifrw = iframe.contents();

      $.get(url).done(function(data) {
        htmlText = data;
        var ifr = document.getElementById("iframeResult");
        var ifr_ = (ifr.contentWindow) ? ifr.contentWindow : (
          ifr.contentDocument.document) ?
          ifr.contentDocument.document : ifr.contentDocument;

        ifr_.document.open();
        ifr_.document.write(htmlText);
        ifr_.document.close();

        if (ifrw.find("body") && !ifrw.find("body").is("[contenteditable]")) {
          ifrw.find("body").attr("contenteditable", true);
          ifrw.find("body").attr("contenteditable", false);
        }
      });

      if (typeof callback === "function") callback();
    } else {
      loadThemeStyle(callback);
    }
  }

  /**
   * Show code as text in a <pre> element.
   * @param {string} content The code
   * @param {string} lang Language name
   */
  function renderRawPreview (content, lang) {
    renderPreview("", lang, function() {
      content = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      $("html").addClass("preview-text").removeClass("preview")
        .find("body").css("overflow", "auto").find(".app").html(
          $("<pre>", {
            class: "jdb-monospace jdb-margin-0"
          }).append(
            $("<code>", {
              html: content,
              class: lang
            })
          )
        );

      try {
        hljs.highlightAll();
      } catch (e) {
        hljs.highlightAuto();
      }
    });
  }

  if (gistId !== null && gistId !== "") getGist(gistId);
  else window.location.href = "/home";
});