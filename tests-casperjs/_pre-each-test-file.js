casper.options.verbose = true;
/*
 * Log statements are only output in verbose mode.
 */
casper.options.logLevel = 'debug';
casper.options.waitTimeout = 7500;

casper.options.clientScripts = [
    /*
     * Make jQuery and Underscore available for use in evaluate() blocks.
     */
    '../lib/jquery/jquery.js'
    , '../lib/underscore.js'

    /*
     * Make two different libraries available for mocking Ajax requests and responses.
     */
    , '../lib/sinon-server.js'
    , '../lib/jquery/jquery.mockjax.js'
];

casper.options.viewportSize = {width: 1440, height: 900};



casper.options.testsToSkip = [
     'broken-test'
     , 'old-test'
];

casper.options.startingUrl = 'http://localhost:8080/';

casper.options.screenCapturePositionAndDimensions = {top: 0, left: 0, width: 1440, height: 2100};



this.mikeTestCtx = {};

/*
 * Mock server responses that are specific to the context test case - using Sinon.
 */
mikeTestCtx.testCaseSpecificSinonMockResponses = [];

/*
 * Mock server responses that are specific to the context test case - using Mockjax.
 */
mikeTestCtx.testCaseSpecificMockjaxResponses = [];



this.mikeTestUtils = {};

/*
 * Using the output of CasperJS' test.currentTestFile, "construct" a 
 * short identifier for the given test script.
 */
mikeTestUtils.calcTestCaseName = function(testFilePath) {
     // test-cases/a-test.js
     var result = '';
     var idx1 = testFilePath.lastIndexOf('/');
     var idx2 = testFilePath.lastIndexOf('.');
     result = testFilePath.substring(idx1 + 1, idx2);
     // a-test
     return result;
};

/*
 * Wrap the standard casper.capture function, placing all snapshots in 
 * a standard directory, organized by test case, using a globally-defined 
 * capture position and dimensions.
 */
mikeTestUtils.screenCapture = function(testCase, targetFileName) {
     casper.capture(
          'snapshots/' + testCase + '/' + targetFileName
          , casper.options.screenCapturePositionAndDimensions
     );
};



casper.on('page.error', function(msg, trace) {
     this.log('Error: ' + msg, 'ERROR', 'error');
     this.log('Trace: ' + JSON.stringify(trace), 'error');
});

casper.on('error', function(msg, trace) {
     this.log('Error: ' + msg, 'ERROR', 'error');
     this.log('Trace: ' + JSON.stringify(trace), 'error');
});

casper.on('step.error', function(err) {
     this.log('Step has failed: ' + err, 'error');
});

casper.on('step.timeout', function() {
     this.log('Step has timed-out.', 'error');
});

casper.on('timeout', function() {
     this.log('timeout', 'error');
});

/*
 * When a waitFor function times-out, log the error and save a screenshot 
 * of the UI in its current state.
 */
casper.on('waitFor.timeout', function() {
     this.log('waitFor.timeout', 'error');
     mikeTestUtils.screenCapture('', 'waitFor-timeout.png');
});

/*
 * Capture the output of console.log() statements included in the 
 * JavaScript on the site that is being tested.
 */
casper.on('remote.message', function(msg) {
     this.log('    Logged in remote page DOM -> ' + msg, 'debug');
});
    
/*
 * Capture alert() statements included in the JavaScript on the site 
 * that is being tested. 
 */
casper.on('remote.alert', function(msg) {
     this.log('    Alert shown remote page DOM -> ' + msg, 'info');
}); 



casper.on('load.finished', function(resource) {

     this.evaluate(function (testCaseSpecificSinonMockResponses, testCaseSpecificMockjaxResponses) 
     {
         
          /*
           * Prepare the Sinon.JS fake server for use to mock Ajax responses. 
           * Configure the server to auto-respond to each request and filter out 
           * those Ajax requests that we don't want to mock.
           */
          var server = sinon.fakeServer.create();
          server.autoRespond = true;
          sinon.FakeXMLHttpRequest.useFilters = true;
          sinon.FakeXMLHttpRequest.addFilter(
          function(method, url, async, username, password) {
               /*
                * Requests to the server for static templates should be 
                * allowed through (un-mocked).
                */
               if (url.indexOf('\/templates') === 0) {
                    // console.log('Request being let through - url = ' + url + ', method = ' + method);
                    return true;
               }
               else {
                    console.log('Request being mocked - url = ' 
                         + url + ', method = ' + method);
               }
          });

          testCaseSpecificSinonMockResponses.forEach(function (element) {
               if (element.url) {
                    server.respondWith(element.method, element.url, element.response);
               }
               else {
                    server.respondWith(element.method, new RegExp(element.regexp), element.response);
               }
          });

          $.mockjaxClear();

          testCaseSpecificMockjaxResponses.forEach(function (element) {
               if (element.url) {
                    var idx = $.mockjax(element);
               }
               else {
                    element.url = new RegExp(element.regexp);
                    var idx = $.mockjax(element);
               }
          });

          /*
           * Prepare mock server responses that are applicable to 
           * multiple test cases.
           */
          // Add as needed.

     }, mikeTestCtx.testCaseSpecificSinonMockResponses, mikeTestCtx.testCaseSpecificMockjaxResponses);

});
