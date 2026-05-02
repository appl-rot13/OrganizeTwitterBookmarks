(() => {
  const autoScroll = ({ speed = 10, ignoreCount = 120 } = {}) => {
    return new Promise(resolve => {
      let lastScrollY = window.scrollY;
      let idleCount = 0;

      function step() {
        window.scrollBy(0, speed);

        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
          lastScrollY = currentScrollY;
          idleCount = 0;
        } else {
          idleCount++;
        }

        if (idleCount < ignoreCount) {
          window.requestAnimationFrame(step);
        } else {
          resolve();
        }
      }

      window.requestAnimationFrame(step);
    });
  }

  const downloadAsCsv = (data, filename) => {
    if (!Array.isArray(data) || data.length === 0) {
      return;
    }

    const header = Object.keys(data[0]);
    const csv = [
      header,
      ...data.map(obj => header.map(key => obj[key]))
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  let scrollPromise = null;

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
      console.log(href);

      if (!scrollPromise) {
        scrollPromise = autoScroll();
        scrollPromise.then(() => {
          observer.disconnect();

          const data = Array.from(hrefs)
            .reverse()
            .map((value, index) => ({
              No: index + 1,
              URL: value,
            }));

          downloadAsCsv(data, 'bookmarks.csv');
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
