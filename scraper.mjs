import puppeteer from 'puppeteer';
import sanitizeFilename from 'sanitize-filename';

import { red, green, blue } from './';

const URL = paths => `https://frontendmasters.com/${paths.join('/')}`;

const scraper = async ({ username, password, targetCourse }) => {
  try {
    // This will list our videos, with their titles and video src URL.
    // This array will be returned at the end of our function.
    const CURRICULUM = [];

    // Launch Chrome
    const browser = await puppeteer.launch({ headless: false });
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
    // Click through each link so it loads the video
    let index = 0;
    for (const link of lessonLinks) {
      await link.click();
      // WOAH THE PONY!
      // Try make it look less suspect...
      const betweenEightAndTwelveSeconds = (Math.floor(Math.random() * 12) + 8) * 1000;
      await page.waitFor(betweenEightAndTwelveSeconds);

      const paddedIndex = String(index).padStart(2, '0');
      const sanitizedTitle = sanitizeFilename(await link.$eval('.title', title => title.innerText)).replace(/\s/gi, '_');
      const item = {
        title: `[${paddedIndex}] - ${sanitizedTitle}`,
      };
      item.src = await page.evaluate(video => video.src, video);
      blue(`Adding "${item.title}" to curriculum`);
      CURRICULUM.push(item);
      index = index + 1;
    }

    return CURRICULUM;
  } catch (error) {
    red(`\n ${error} \n`);
  }
};

export default scraper;