var keywords = ["cookie", "tracking", "gdpr", "consent"];

function findCookieBanners(lengthLimit) {
  let banners = [];
  keywords.forEach((keyword) => {
    banners.push(...findCookieBannersByKeyword(keyword, lengthLimit));
  });
  return banners.filter((b) => b);
}
function findCookieBannersByKeyword(keyword, lengthLimit) {
  return [...document.getElementsByTagName("*")]
    .filter((candidate) => matchesKeyword(candidate, keyword))
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

function matchesKeyword(candidate, keyword) {
  return (
    classMatchesKeyword(candidate, keyword) ||
    idMatchesKeyword(candidate, keyword) ||
    textContentMatchesKeyword(candidate, keyword)
  );
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

function removeCookieBanners(lengthLimit) {
  findCookieBanners(lengthLimit)
    .filter((banner) => banner)
    .forEach((banner) => {
      console.log(
        "removing cookie banner with length " +
          banner.innerText.length +
          " and element:"
      );
      console.log(banner);
      banner.remove();
    });
}

// immediate execution
removeCookieBanners(200);

// for lazy loaded cookie consent plugins
setTimeout(function () {
  removeCookieBanners(200);
}, 250);
setTimeout(function () {
  removeCookieBanners(1000);
}, 3000);
