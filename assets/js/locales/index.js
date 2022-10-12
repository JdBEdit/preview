import Si18n from "https://cdn.jsdelivr.net/npm/si18n.js@1.2.0/si18n.min.js";
import getJSON, { updateUrlParam } from "/assets/js/utils.js"

const locInstance = new Si18n();
const activeClass = "jdb-leftbar";
const locales = {
  fr: await getJSON("/assets/js/locales/fr.json"),
  en: await getJSON("/assets/js/locales/en.json")
};

locInstance.init({
  locales,
  lang: "fr",
  fallbackLang: "fr",
  saveAs: "hl",
  activeClass,
  togglersSelector: ".i18n-togglers [data-lang]",
  translate() {
    $("meta[name=description").attr("content", locInstance.t("description", {
      appName: "JdBEdit Preview",
      gistURL: `Gist GitHub`,
      appURL: `JdBEdit`
    }));

    $(`[data-lang].${activeClass}`).removeClass(activeClass);
    $(`[data-lang="${locInstance.getLocale()}"]`).addClass(activeClass);

    $("#site-description").html(locInstance.t("description", {
      appName: "<strong>JdBEdit Preview</strong>",
      gistURL: `<a href="https://gist.github.com" target="_blank" rel="noopener noreferrer">Gist GitHub</a>`,
      appURL: `<a href="https://code.wetrafa.xyz" target="_blank">JdBEdit</a>`
    }));

    $("#update-id-input").attr("placeholder", locInstance.t("gistInput.placeholder"));
    $("#dark-theme").attr("label", locInstance.t("darkThemes"));
    $("#light-theme").attr("label", locInstance.t("lightThemes"));

    updateUrlParam("hl", locInstance.getLocale());
  }
});

export default locInstance;
