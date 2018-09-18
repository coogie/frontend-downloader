import puppeteer from 'puppeteer';

const URL = paths => `https://frontendmasters.com/${paths.join('/')}`;

export const scraper = async ({ username, password, targetCourse, directory }) => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 30,
  });
  const page = await browser.newPage();
  await page.goto(URL(['login']));
  await page.waitForSelector('#loginForm');

  const emailInput = await page.$('#username')
  const passwordInput = await page.$('#password')
  const loginButton = await page.$('.Button.ButtonRed.ButtonLarge.g-recaptcha');

  await emailInput.click();
  await emailInput.type(username);
  await passwordInput.click();
  await passwordInput.type(password);
  await loginButton.click();
  await page.waitForNavigation();

  await page.goto(URL(['courses', targetCourse]));
  
  await page.waitForSelector('.Button.ButtonRed');
  const watchButton = await page.$('.Button.ButtonRed');
  await watchButton.click();
  await page.waitForNavigation();

  await page.waitForSelector('.FMPlayerScrolling > li');
  const lessonLinks = await page.$$('.FMPlayerScrolling > li > a');
  // const lessonLinkss = Promise.all(lessonLinks.map(link => page.evaluate()));
}