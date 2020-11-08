var idMatchers = [
  "cmpbox",
  "cookie-note",
  "cookie-law-info-bar",
  "cf-root",
  "cookiefirst-root",
  "CybotCookiebotDialog",
  "usercentrics-root",
  "onetrust-consent-sdk",
  "onetrust-banner-sdk",
  "ppms_cm_popup_overlay",
  "consent_blackbar",
  "truste-consent-track",
  "consent-bump",
  "sp_message_container",
  "consentBanner",
  "cookie-banner-root",
  "tracking",
  "gdpr",
  "consent",
  "gdpr-banner-container",
];
var classMatchers = [
  "cmpbox",
  "qc-cmp-ui-container",
  "qc-cmp-showing",
  "wt-cli-cookie-bar-container",
  "wt-cli-cookie-bar",
  "BorlabsCookie",
  "osano-cm-window",
  "js-cookie-consent-banner",
  "ppms_cm_popup_overlay",
  "hx_cookie-banner",
  "consent",
  "tracking",
  "gdpr",
  "consent",
  "js-consent",
  "message-container", // dangerous!
];
var contentMatchers = ["cookie", "tracking", "gdpr", "consent"];

// most cookie consent banenrs are lazy loaded
[1, 10, 100, 500, 1000, 3000, 5000, 7500, 10000].forEach((timeout) =>
  setTimeout(() => removeCookieBanners(200), timeout)
);

function removeCookieBanners(lengthLimit) {
  findCookieBanners(lengthLimit)
    .filter((banner) => banner)
    .forEach((banner) => {
      console.debug("removing cookie banner:");
      console.debug(banner);
      banner.remove();
    });
  repairBodyScrollBehaviour();
}

function findCookieBanners(lengthLimit) {
  let banners = [];
  idMatchers.forEach((keyword) => {
    banners.push(
      ...findCookieBannersByKeyword(keyword, idMatchesKeyword, lengthLimit)
    );
  });
  classMatchers.forEach((keyword) => {
    banners.push(
      ...findCookieBannersByKeyword(keyword, classMatchesKeyword, lengthLimit)
    );
  });
  contentMatchers.forEach((keyword) => {
    banners.push(
      ...findCookieBannersByKeyword(
        keyword,
        textContentMatchesKeyword,
        lengthLimit
      )
    );
  });
  return banners.filter((b) => b);
}

function findCookieBannersByKeyword(keyword, matcher, lengthLimit) {
  return [...document.getElementsByTagName("*")]
    .filter((candidate) => matcher(candidate, keyword))
    .map((match) => findCookieBannerContainer(match, lengthLimit))
    .filter((container) => container);
}

function findCookieBannerContainer(candidate, lengthLimit) {
  if (candidate) {
    return isBannerContainer(candidate, lengthLimit)
      ? candidate
      : findCookieBannerContainer(candidate.parentElement, lengthLimit);
  }
}

function classMatchesKeyword(candidate, keyword) {
  return (
    candidate.className &&
    candidate.className.toLowerCase &&
    candidate.className.toLowerCase().includes(keyword)
  );
}

function idMatchesKeyword(candidate, keyword) {
  return (
    candidate.id &&
    candidate.id.toLowerCase &&
    candidate.id.toLowerCase().includes(keyword)
  );
}

function textContentMatchesKeyword(candidate, keyword) {
  return (
    candidate.innerText &&
    candidate.innerText.toLowerCase().includes(keyword) &&
    isKeywordLeaf(candidate, keyword)
  );
}

function isKeywordLeaf(candidate, keyword) {
  return (
    [...candidate.children].filter(
      (child) => child.innerText && child.innerText.includes(keyword)
    ).length == 0
  );
}

function isBannerContainer(candidate, lengthLimit) {
  return (
    candidate &&
    parseInt(getComputedStyle(candidate)["z-index"]) &&
    hasPositionStyleUsedForBanners(candidate) &&
    candidate.innerText.length < lengthLimit
  );
}
function hasPositionStyleUsedForBanners(candidate) {
  return (
    getComputedStyle(candidate).position == "fixed" ||
    getComputedStyle(candidate).position == "relative" ||
    getComputedStyle(candidate).position == "absolute"
  );
}

function repairBodyScrollBehaviour() {
  const body = document.querySelector("body");
  body.style.overflow = "auto !important";
  body.style.position = "inherit !important";
  const html = document.querySelector("html");
  html.style.overflow = "auto !important";
  html.style.position = "inherit !important";
}
