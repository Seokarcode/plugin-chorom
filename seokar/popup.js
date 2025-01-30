document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: analyzeSEO
      },
      (results) => {
        const result = results[0].result;
        document.getElementById('title').innerText = result.title;
        document.getElementById('meta-description').innerText = result.metaDescription;
        document.getElementById('h1-count').innerText = result.h1Count;
        document.getElementById('h2-count').innerText = result.h2Count;
        document.getElementById('word-count').innerText = result.wordCount;
        document.getElementById('internal-links').innerText = result.internalLinks;
        document.getElementById('external-links').innerText = result.externalLinks;
        document.getElementById('broken-links').innerText = result.brokenLinks;
        document.getElementById('load-time').innerText = result.loadTime + ' ms';
        document.getElementById('keywords-title').innerText = result.keywordsTitle;
        document.getElementById('keywords-meta').innerText = result.keywordsMeta;
        document.getElementById('keywords-content').innerText = result.keywordsContent;
        document.getElementById('domain-name').innerText = result.domainName;
        document.getElementById('domain-age').innerText = result.domainAge;
        document.getElementById('http-requests').innerText = result.httpRequests;
        document.getElementById('page-size').innerText = result.pageSize + ' KB';
        document.getElementById('num-scripts').innerText = result.numScripts;
        document.getElementById('mobile-preview').innerText = result.mobilePreview;
        document.getElementById('mobile-load-time').innerText = result.mobileLoadTime + ' ms';
        document.getElementById('open-graph').innerText = result.openGraph;
        document.getElementById('twitter-card').innerText = result.twitterCard;

        document.getElementById('generate-pdf').addEventListener('click', () => generatePDF(result));
        document.getElementById('export-csv').addEventListener('click', () => exportCSV(result));
      }
    );
  });
});

function analyzeSEO() {
  const title = document.title;
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || 'No meta description found';
  const h1Count = document.querySelectorAll('h1').length;
  const h2Count = document.querySelectorAll('h2').length;
  const wordCount = document.body.innerText.split(/\s+/).filter(word => word.length > 0).length;

  const links = document.querySelectorAll('a');
  let internalLinks = 0;
  let externalLinks = 0;
  let brokenLinks = 0;
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('http')) {
      if (href.includes(window.location.hostname)) {
        internalLinks++;
      } else {
        externalLinks++;
      }
      
      // Check if link is broken by making a head request
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', href, false);
      try {
        xhr.send();
        if (xhr.status >= 400) {
          brokenLinks++;
        }
      } catch (e) {
        brokenLinks++;
      }
    }
  });

  const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;

  const keywords = ['keyword1', 'keyword2', 'keyword3']; // Replace with your keywords
  const keywordsTitle = keywords.filter(keyword => title.includes(keyword)).join(', ') || 'No keywords found';
  const keywordsMeta = keywords.filter(keyword => metaDescription.includes(keyword)).join(', ') || 'No keywords found';
  const content = document.body.innerText;
  const keywordsContent = keywords.filter(keyword => content.includes(keyword)).join(', ') || 'No keywords found';

  const domainName = window.location.hostname;
  const domainCreationDate = new Date(document.domainCreationDate || new Date());
  const domainAge = Math.floor((new Date() - domainCreationDate) / (1000 * 60 * 60 * 24 * 365)) + ' years';

  const httpRequests = window.performance.getEntriesByType('resource').length;
  const pageSize = Math.round([...window.performance.getEntriesByType('resource')]
    .reduce((total, entry) => total + (entry.transferSize || 0), 0) / 1024);
  const numScripts = document.querySelectorAll('script').length;

  const mobilePreview = 'Mobile preview not implemented'; // Placeholder for mobile preview
  const mobileLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart; // Placeholder for mobile load time

  const openGraph = document.querySelectorAll('meta[property^="og:"]').length ? 'Open Graph tags found' : 'No Open Graph tags';
  const twitterCard = document.querySelectorAll('meta[name^="twitter:"]').length ? 'Twitter Card tags found' : 'No Twitter Card tags';

  return {
    title,
    metaDescription,
    h1Count,
    h2Count,
    wordCount,
    internalLinks,
    externalLinks,
    brokenLinks,
    loadTime,
    keywordsTitle,
    keywordsMeta,
    keywordsContent,
    domainName,
    domainAge,
    httpRequests,
    pageSize,
    numScripts,
    mobilePreview,
    mobileLoadTime,
    openGraph,
    twitterCard
  };
}

function generatePDF(result) {
  // Implement PDF generation logic here
  alert('PDF generation is not implemented yet.');
}

function exportCSV(result) {
  // Implement CSV export logic here
  alert('CSV export is not implemented yet.');
}
