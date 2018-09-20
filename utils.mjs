import chalk from 'chalk';

export const waitBetweenSeconds = (min, max) => (Math.floor(Math.random() * max) + min) * 1000;
export const red = message => console.log(chalk.red(message));
export const green = message => console.log(chalk.green(message));
export const blue = message => console.log(chalk.blue(message));
