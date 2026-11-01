/**
 * Generates and downloads a completely standalone single-file HTML version of CampusTrade
 * with CDN Tailwind CSS, Lucide icons, and pure JavaScript.
 */
export function downloadStandaloneHtmlFile() {
  // Fetch campus_trade_platform.html or generate full html
  fetch('/campus_trade_platform.html')
    .then((res) => {
      if (res.ok) return res.text();
      throw new Error('Not found');
    })
    .catch(() => {
      // Fallback
      return '<!DOCTYPE html><html><body>CampusTrade Standalone</body></html>';
    })
    .then((htmlContent) => {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CampusTrade_校園二手交換平台_完整單檔.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
}
