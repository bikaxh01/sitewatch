import puppeteer from "puppeteer";

export async function takeScreenShort(url: string, urlId: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const path = `./src/images/${urlId + "-" + Date.now()}.png`;
  try {
    await page.setViewport({ width: 1080, height: 1024 });
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    const res = await page.screenshot({
      path,
    });
  } catch (error: any) {
    console.log("🚀 ~ takeScreenShort ~ error:", error)
    const fallbackHtml = `
      <html>
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#ffe6e6;color:#990000;">
          <div style="text-align:center;">
            <h1>Site Unavailable</h1>
            <p><strong>${url}</strong> is currently unreachable.</p>
            <p>Error: ${error.message}</p>
          </div>
        </body>
      </html>
    `;
    await page.setContent(fallbackHtml);
    await page.screenshot({ path });
  } finally {
    await browser.close();
    return path
  }
}
