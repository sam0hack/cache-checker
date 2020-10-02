const URL_HAS_PROTOCOL_REGEX = /^https?:\/\//i;

url_verify = URL => URL.match(URL_HAS_PROTOCOL_REGEX) ? URL : `https://${URL}`;

module.exports = url_verify;