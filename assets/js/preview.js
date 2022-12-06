/*! Copyright 2017 - 2021 JdBEdit. All rights reserved. */
import hljs_all_themes from "/assets/js/constants.js";

$(document).ready(function(){
  const gistId = jdb.getUrlParam("id");
  const renderCode = jdb.getUrlParam("render") || "true";
  let lang;

  /**
   * Load css file for highlight.js.
   * @private
   * @param {requestCallback} [callback] Callback.
   */
  function loadThemeStyle (callback) {
    const hljs_version = "11.5.1"; // 10.3.1
    const hljs_name = "highlight";
    let hljs_user_theme = (jdb.getUrlParam("theme") || "").toLowerCase();
    const path = `//cdnjs.cloudflare.com/ajax/libs/${hljs_name}.js/`;
    let hljs_themes = hljs_all_themes.dark.concat(hljs_all_themes.light);

    if (hljs_user_theme !== null) {
      let i, itheme, validTheme = false;
      for (i = 0; !validTheme && i < hljs_themes.length; i++) {
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
      href: `${path + hljs_version}/styles/${hljs_user_theme}.min.css`
    }).appendTo("head");

    $.getScript(`${path + hljs_version}/${hljs_name}.min.js`).done(() => {
      if (callback) callback();
    });
  }

  /**
   * Creates an iframe and puts it in the page.
   * @private
   * @returns {Element} The preview iframe.
   */
  function createIframe() {
    const $iframe = $("<iframe>", {
      id: "iframeResult",
      name: "iframeResult",
      src: /* !!url ? url : */ "about:blank",
      sandbox: "allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-downloads allow-pointer-lock allow-presentation allow-scripts allow-top-navigation-by-user-activation",
      allow: "midi; geolocation; microphone; camera; fullscreen; encrypted-media; accelerometer; gyroscope; payment; usb; clipboard-read; clipboard-write; web-share",
      allowtransparency: true,
      allowfullscreen: true,
      frameborder: 0,
    }).attr({
      width: "100%",
      height: "100%"
    }).on("load", () => {
      const $el = $("#iframeResult").contents().find(window.location.hash);
      if ($el.length > 0) {
        $("#iframeResult").contents().scrollTop($el.offset().top);
      }
    });

    $(".app").css({
      position: "absolute",
      left: 0, right: 0,
      bottom: 0, top: 0,
    }).append($iframe);

    return $iframe;
  }

  /**
   * Add JdB.CSS classes to some rendered elements.
   * @private
   */
  function addJdBClasses() {
    $(".app table").each((i, el) => {
      $(el).addClass("jdb-table-all jdb-bordered-all jdb-hoverable");
    });

    $(".app details").each((i, el) => {
      $(el).addClass("jdb-margin-8 jdb-padding")
        .find("summary").addClass("jdb-border jdb-round-md jdb-focusable");
    });

    $(".app > ul").each((i, el) => {
      $(el).addClass("jdb-ul jdb-hoverable");
    });

    $(".app > ol").each((i, el) => {
      $(el).addClass("jdb-ol");
    });
  }

  /**
   * Get an existing gist file.
   * @private
   * @param {string} gistId Gist ID.
   */
  function getGist (gistId) {
    $.ajax({
      url: `https:\/\/api.github.com\/gists\/${gistId}`,
      type: "GET",
      statusCode: {
        404: () => {
          $("html").addClass("is404")
            .find(".app").addClass("jdb-unselectable").append(
              `<a class="home" href="/home?ref=404">
                <span style="color:green">&gt;</span> Accueil
              </a>
              <!-- See the license at: https://codepen.io/conmarap/details/mVMvVv/#details-tab-license -->
              <div class="code-area jdb-monospace">
                <span style="color:#777; font-style:italic">
                // 404 - File not found.</span>
                <span>
                <span style="color:#d65562">if </span>(<span style="color:#4ca8ef">!</span><span style="font-style:italic;color:#bdbdbd">found</span>) {</span><span><span style="padding-left:15px;color:#2796ec"><i style="width:10px; display:inline-block"></i>throw </span><span>(<span style="color: #a6a61f">'¯\_(ツ)_/¯'</span>);</span><span style="display:block">}</span></span>
              </div>`
            );
        }
      }
    }).done(datas => {
      let data = datas.files[Object.keys(datas.files)[0]];
      lang = data.language.toLowerCase();

      $("head").append( $("<meta>", { content: data.description, name: "description" })
      ).append( $("<meta>", { content: data.description, name: "twitter:description"})
      ).append( $("<meta>", { content: data.description, itemprop: "description"})
      ).append( $("<meta>", { content: data.description, property: "og:description" })
      ).append( $("<meta>", { content: window.location.href, property: "og:url" })
      ).find("title").text(() => {
        let fileName = data.filename;
        if (!fileName.match(/^\./)) {
          fileName = fileName.split(".")?.shift();
        }
        return `${fileName} - JdBEdit Preview`;
      });

      if ((lang === "html" || lang === "svg") && renderCode !== "false") {
        $("html").css("overflow", "hidden");
        renderPreview(data.content);
      } else if (lang === "markdown" && renderCode !== "false") {
        $.getScript("/assets/js/marked.js").done(() => {
          $(".app").addClass(["max", "preview-markdown"]).html(marked(data.content));

          addJdBClasses();
          loadThemeStyle(() => {
            document.querySelectorAll("pre code").forEach((el) => {
              hljs.highlightElement(el);
            });
          });

          $("head").append(
            $("<link>", {
              rel: "stylesheet",
              href: "/assets/css/native-elements-style.css"
            })
          ).next("body").find(".app").addClass("markdown-body");

          if (window.location.hash) {
            setTimeout(() => {
              const $el = $(window.location.hash);
              if ($el.length > 0) $("html, body").scrollTop($el.offset().top);
            }, 100);
          }
        });
      } else {
        renderRawPreview(data.content, lang);
        highlightCodes();
      }
    });
  }

  /**
   * Render the given content as HTML or XML (SVG).
   * @private
   * @param {string} content The content to render.
   * @param {requestCallback} [callback] Callback.
   */
  function renderPreview (content, callback) {
    let ifrw = createIframe().contents();
    let ifr = document.getElementById("iframeResult");
    let ifr_ = (ifr.contentWindow) ?
      ifr.contentWindow : ifr.contentDocument.document ?
      ifr.contentDocument.document : ifr.contentDocument;

    ifr_.document.open();
    ifr_.document.write(content);
    ifr_.document.close();

    if (ifrw.find("body") && !ifrw.find("body").is("[contenteditable]")) {
      ifrw.find("body").attr("contenteditable", true);
      ifrw.find("body").attr("contenteditable", false);
    }

    if (typeof callback === "function") callback();
  }

  /**
   * Show code as text in a <pre> element.
   * @private
   * @param {string} content The code to show.
   * @param {string} lang Language name
   */
  function renderRawPreview (content, lang) {
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
  }

  /**
   * Highlight all the code in the page.
   * @private
   */
  function highlightCodes() {
    loadThemeStyle(() => {
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
