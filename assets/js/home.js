/*! Copyright 2017 - 2021 JdBEdit. All rights reserved. */
import hljs_all_themes from "/assets/js/constants.js";
import locInstance from "/assets/js/locales/index.js";
import showError from "/assets/js/utils.js";

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

  let themeOptGroup = `<optgroup id="dark-theme" label="${locInstance.t("darkThemes")}">`;
  themeOptGroup += `<option value="" selected data-si18n="selectTheme">${locInstance.t("selectTheme")}</option>`;
  for (let i = 0; i < hljs_all_themes.dark.length; i++) {
    themeOptGroup += `<option value="${hljs_all_themes.dark[i].replace(/\s/g, "-").toLowerCase()}">
      ${hljs_all_themes.dark[i]}</option>`;
  }
  themeOptGroup += `</optgroup>`;
  $("#setting-theme").append(themeOptGroup);

  themeOptGroup = `<optgroup id="light-theme" label="${locInstance.t("lightThemes")}">`;
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
