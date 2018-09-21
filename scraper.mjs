import puppeteer from 'puppeteer';
import sanitizeFilename from 'sanitize-filename';

import { red, green, blue, waitBetweenSeconds } from './utils';

const URL = paths => `https://frontendmasters.com/${paths.join('/')}`;

const scraper = async ({ username, password, targetCourse }) => {
  try {
    // This will list our videos, with their titles and video src URL.
    // This array will be returned at the end of our function.
    const CURRICULUM = {
      title: '',
      author: '',
      description: '',
      published: '',
      modules: [],
    };

    // Launch Chrome
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Log in to FEM
    await page.goto(URL(['login']));
    await page.waitForSelector('#loginForm');
    blue('Attempting login');
    blue(`Entering username: ${username}`);
    await page.type('#username', username);
    blue(`Entering password: ${password.replace(/./gi, '*')}`);
    await page.type('#password', password);
    await Promise.all([
      page.click('.Button.ButtonRed.ButtonLarge.g-recaptcha'),
      page.waitForNavigation()
    ]);
    green('Successfully logged in');

    // Go to the course specified in the ENV var
    blue(`Navigating to course: ${targetCourse}`);
    await page.goto(URL(['courses', targetCourse]));
    green('Successfully navigated to course');

    // Gather the course metadata
    CURRICULUM.title = await page.$eval('.title', e => e.innerText);
    CURRICULUM.author = await page.$eval('.name', e => e.innerText);
    CURRICULUM.description = await page.$eval('div.summary:nth-child(1) > p:nth-child(1)', e => e.innerText);
    CURRICULUM.published = await page.$eval('.published', e => e.innerText);

    // Navigate to the Player Page for that course
    blue('Navigating to course player page');
    const firstLessonSelector = '.CourseToc .LessonList:first-of-type > li:first-child > a';
    await page.waitForSelector(firstLessonSelector);
    await Promise.all([
      page.click(firstLessonSelector),
      page.waitForNavigation()
    ]);
    green('Successfully navigated to course player page');

    // Gather up all the links for each video
    await page.waitForSelector('.FMPlayerScrolling > li');
    const video = await page.$('video');
    const lessonLinks = await page.$$('.FMPlayerScrolling > li:not(.lesson-group) > a');

    blue('Aggregating player links and building curriculum');
    blue('------------------------------------------------')
    blue('|  THIS MAY TAKE SOME TIME! FEEL FREE TO MAKE  |')
    blue('|  YOURSELF A CUP OF TEA AND CONTEMPLATE LIFE  |')
    blue('------------------------------------------------')
    // Click through each link so it loads the video
    let index = 0;
    for (const link of lessonLinks) {
      await link.click();
      // WOAH THE PONY!
      // Try make it look less suspect...
      const delay = waitBetweenSeconds(8, 14);
      blue(`Waiting ${delay/1000} seconds`);
      await page.waitFor(delay);

      const paddedIndex = String(index).padStart(2, '0');
      const sanitizedTitle = sanitizeFilename(await link.$eval('.title', title => title.innerText)).replace(/\s/gi, '_');
      const item = {
        title: `[${paddedIndex}] - ${sanitizedTitle}`,
      };
      item.src = await page.evaluate(video => video.src, video);
      blue(`Adding "${item.title}" to curriculum`);
      CURRICULUM.modules.push(item);
      index = index + 1;
    }

    browser.close();
    return CURRICULUM;
  } catch (error) {
    red(`\n ${error} \n`);
    throw Error(error);
    process.exit(1);
  }
};

export default scraper;