# Frontend Downloader

Simple Node script to automate the login and download of course videos from
http://frontendmasters.com/ for Offline Viewing on Desktop/Laptop.

*Only tested on Node v10.7*

*Requires `--experimental-modules` flag.*

## Setup

Run `yarn` or `npm install`.

Create a `.env` file in the root and populate it with the following variables:

| Variable                | Value                   |
| ----------------------- | ----------------------- |
| FRONTEND_MASTERS_USER   | E.g.: `youremail@domain.com`  |
| FRONTEND_MASTERS_PASS   | E.g.: `hunter2`               |
| FRONTEND_MASTERS_COURSE | The URL slug for the course. E.g. for `https://frontendmasters.com/courses/progressive-web-apps/` the value of this would be `progressive-web-apps` |

## Running

Run `yarn start` or `npm start`.

### Important note

This might get your account banned. If that happens that's all your fault for running
this script, not mine.