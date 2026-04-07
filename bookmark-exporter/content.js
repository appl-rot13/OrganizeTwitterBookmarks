(() => {
  const hrefs = new Set();
  const observer = new MutationObserver(() => {
    document.querySelectorAll('article[data-testid="tweet"]').forEach(tweet => {
      const link = tweet.querySelector('div[data-testid="User-Name"] a:has(time)');
      if (!link) {
        return;
      }

      const href = link.href;
      if (hrefs.has(href)) {
        return;
      }

      hrefs.add(href);
      console.log(hrefs.size + ': ' + href);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
