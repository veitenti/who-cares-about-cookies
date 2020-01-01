var keywords = ['cookie', 'tracking', 'cc-window', 'as-oil', 'gdpr', 'consent'];

function removeSingleCookieBanner(banner) {
  if (banner && getComputedStyle(banner).position == 'fixed') {
    banner.remove();
    console.info('removed cookie consent banner with id: ' + banner.id);
  }
}

function removeCookieBanners() {
  keywords.forEach(function(id) {
    document.querySelectorAll('div[id*="' + id + '"]').forEach(removeSingleCookieBanner);
    document.querySelectorAll('div[class*="' + id + '"]').forEach(removeSingleCookieBanner);
  });
}

// immediate execution
removeCookieBanners();

// for lazy loaded cookie consent plugins
setTimeout(function() {
  removeCookieBanners();
}, 250);
