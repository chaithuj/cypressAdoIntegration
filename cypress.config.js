const { defineConfig } = require("cypress");
const fs = require('fs')
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = defineConfig({
  env: {
    url: "https://example.cypress.io"
  },
  e2e: {
    specPattern: "**/**.feature",
    video: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    chromeWebSecurity: false,
    videoCompression: 1,
    screenshotOnRunFailure: false,
    failOnStatusCode: false,
    retries: 0,
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber())
      on('after:run', (results) => {
        if (results) {
          fs.mkdirSync("report/run", { recursive: true });
          fs.writeFile("report/run/results.json", JSON.stringify(results));
        }
      })
    },
  },
});
