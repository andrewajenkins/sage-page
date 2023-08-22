// Karma configuration
// Generated on Mon Aug 07 2023 14:47:36 GMT-0700 (Pacific Daylight Time)

// const puppeteer = require("puppeteer");
// process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",
    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    // list of files / patterns to load in the browser
    // files: [
    //   {
    //     pattern: "./src/app/app.component.spec.ts",
    //     type: "js",
    //   },
    // ],
    // list of files / patterns to exclude
    exclude: [],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    // preprocessors: {},
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ["progress"],
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autowatch: false,
    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ["Chrome"],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity,
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      // require("karma-coverage-istanbul-reporter"),
      require("@angular-devkit/build-angular"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    // preprocessors: {
    //   "./src/test.ts": ["@angular-devkit/build-angular"],
    // },
    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },
  });
};
