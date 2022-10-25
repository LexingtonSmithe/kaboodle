const { defineConfig } = require("cypress");

const username = "kdemo";
const password = "WtPcFcA09";

module.exports = defineConfig({

  env: {
    url: 'https://' + username + ':'+ password + '@staging-bookings.kaboodle.co.uk/landing?client_id=124&agent_id=1534733&package_id=15739&adults=0&children=0&infants=0&currency_id=98',
    chromeWebSecurity: false,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
