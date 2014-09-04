casper.test.begin('Test scenario 1 for the site.' /*, planned nbr of tests */, {
     setUp: function(test) {
          mikeTestCtx.testCase = mikeTestUtils.calcTestCaseName(test.currentTestFile);

          mikeTestCtx.testCaseSpecificSinonMockResponses = [
          
          ];

          mikeTestCtx.testCaseSpecificMockjaxResponses = [

          ];
     }

     , tearDown: function(test) {
          mikeTestCtx.testCaseSpecificSinonMockResponses = [];
          mikeTestCtx.testCaseSpecificMockjaxResponses = [];
     }

     , test: function(test) {
          casper.start();

          /*
           * Don't run any of the tests in this script if the script has 
           * been included in the ignore list.
           */
          casper.thenBypassIf(function() {
               var testsToSkip = casper.options.testsToSkip;
               return testsToSkip.indexOf(mikeTestCtx.testCase) > -1;
          }, 999);

          casper.thenOpen(casper.options.startingUrl, function openStartingUrl(){
               mikeTestUtils.screenCapture(testCtx.testCase, 'start.png');
          });

          casper.then(function testThis(){
               
          });

          casper.then(function testThat(){
               
          });

          casper.run(function runTest() {
               this.log('Test finishing', 'info');

               this.test.done();
          });
     }
});
