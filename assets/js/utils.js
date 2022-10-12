/**
 * Fetch and return as JSON the data from the given url.
 * @param {string} url The URL to fetch.
 * @returns {Promise|void} A promise that resolves to the response.
 */
const getJSON = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

/**
 * Update the given URL parameter.
 * @param {string} name The name of the parameter.
 * @param {string} value The value of the parameter.
 */
export const updateUrlParam = (name, value) => {
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  window.history.replaceState({}, "", url);
};

/**
 * Show the given error message.
 * @private
 * @param {string} [msg] Error message
 */
export const showError = (msg) => {
  if (!msg) msg = "Veuillez fournir un ID de fichier valide.";
  $("#jdb-error-msg").text(msg).slideDown();
  errorTimeout = setTimeout(() => {
    clearTimeout(errorTimeout);
    errorTimeout = null;
  }, 5000);
};

export default getJSON;
