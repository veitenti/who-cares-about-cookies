var keywords = ['cookie', 'tracking', 'gdpr', 'consent'];

function findTopLevelCookieBanners() {
  let found = [];
  Array.from(document.body.children).forEach(function(candidate) {
    if (getComputedStyle(candidate).position === 'fixed') {
      for (let i = 0; i < keywords.length; i++) {
        let keyword = keywords[i];
        if (candidate.textContent.includes(keyword)) {
          // match -> remove
          found.push(candidate);
        }
      }
    }
  });
  return found;
}

function findCookieBannersById() {
  let found = [];
  keywords.forEach(function(id) {
    document.querySelectorAll('div[id*="' + id + '"]').forEach(function(candidate) {
      if (getComputedStyle(candidate).position == 'fixed') {
        found.push(candidate);
      }
    });
  });
  return found;
}

function findCookieBannersByClass() {
  let found = [];
  keywords.forEach(function(clazz) {
    document.querySelectorAll('div[class*="' + clazz + '"]').forEach(function(candidate) {
      if (getComputedStyle(candidate).position == 'fixed') {
        found.push(candidate);
      }
    });
  });
  return found;
}

function removeCookieBanners() {
  let banners = [];
  banners.push(...findTopLevelCookieBanners());
  banners.push(...findCookieBannersById());
  banners.push(...findCookieBannersByClass());
  banners.forEach(function(banner) {
    banner.remove();
    console.info('removed cookie consent banner with id: ' + banner.id);
  });
}

// immediate execution
removeCookieBanners();

// for lazy loaded cookie consent plugins
setTimeout(function() {
  removeCookieBanners();
}, 250);
