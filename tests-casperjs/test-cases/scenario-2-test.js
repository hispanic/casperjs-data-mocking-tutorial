casper.test.begin('Test a site scenario.' /*, planned nbr of tests */, {
     setUp: function(test) {
          mikeTestCtx.testCase = mikeTestUtils.calcTestCaseName(test.currentTestFile);

          mikeTestCtx.testCaseSpecificSinonMockResponses = [
               {method: 'GET', regexp: 'rest-json\/user-session-data\\?_=.*',
                    response: [200, { 'Content-Type': 'application/json' },
                         '{"login":"test-user","accountStatus":"EXPIRED"}']}
          
               , {method: 'GET', url: 'rest-json/book-categories',
                    response: [200, { 'Content-Type': 'application/json' },
                         '[{"id":340734,"description":"Biographies"}' +
                              ',{"id":482913,"description":"Children\'s Books"}' +
                              ',{"id":404267,"description":"Graphic Novels"}' +
                              ',{"id":360628,"description":"History"}' +
                              ',{"id":434621,"description":"Home & Garden"}' +
                              ',{"id":337310,"description":"Humor"}' +
                              ',{"id":367035,"description":"Medicine"}' +
                              ',{"id":368479,"description":"Nonfiction"}' +
                              ',{"id":364578,"description":"Politics"}' +
                              ',{"id":340278,"description":"Reference"}' +
                              ',{"id":422684,"description":"Self-Improvement"}]']}
          
               , {method: 'POST', url: 'rest-json/purchase',
                    response: [200, { 'Content-Type': 'application/json' },
                         '{"transResponse":"APPROVED", "transId":"10289978"}']}
          ];

          mikeTestCtx.testCaseSpecificMockjaxResponses = [
               /* These are duplicates of the above Sinon mocks, but for Mockjax.
               {
                    regexp: 'rest-json\/user-session-data\\?_=.*'
                    , type: 'GET'
                    , status: 200
                    , responseTime: 1
                    , contentType: 'application/json'
                    , responseText:
                          '{"login":"test-user","accountStatus":"EXPIRED"}'
               }
          
               , {
                    url: 'rest-json/book-categories'
                    , type: 'GET'
                    , status: 200
                    , responseTime: 1
                    , contentType: 'application/json'
                    , responseText:
                          '{"id":340734,"description":"Biographies"}' +
                              ',{"id":482913,"description":"Children\'s Books"}' +
                              ',{"id":404267,"description":"Graphic Novels"}' +
                              ',{"id":360628,"description":"History"}' +
                              ',{"id":434621,"description":"Home & Garden"}' +
                              ',{"id":337310,"description":"Humor"}' +
                              ',{"id":367035,"description":"Medicine"}' +
                              ',{"id":368479,"description":"Nonfiction"}' +
                              ',{"id":364578,"description":"Politics"}' +
                              ',{"id":340278,"description":"Reference"}' +
                              ',{"id":422684,"description":"Self-Improvement"}'
               }
          
               , {
                    url: 'rest-json/purchase'
                    , type: 'POST'
                    , status: 200
                    , responseTime: 1
                    , contentType: 'application/json'
                    , responseText:
                          '{"transResponse":"APPROVED", "transId":"10289978"}'
               }
               */
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

          /*
           * Test something.
           */
          casper.then(function testSomething(){
               this.click('#some-link');
          
               this.log('Clicked some link. New URL is ' + this.getCurrentUrl(), 'info');
          
               /*
                * Wait for something to appear or change on-screen before 
                * proceeding.
                */
               casper.waitFor(function waitForSomething() {
                    return this.evaluate(function evaluateSomething() {
                          return document.querySelector('#something') !== null;
                    });
               }
               , function then() {
                    mikeTestUtils.screenCapture(mikeTestCtx.testCase, 'something.png');
          
                    this.test.assertSelectorHasText('#a-link', 'Some Text');

                    this.test.assert(this.evaluate(function evaluateSomething() {
                      return $('#some-input').val() == "some text";
                    }));

               });
          });

          /*
           * Test POST body.
           */
          casper.then(function testPosyBody(){
               this.click('#some-button');
          
               this.log('Clicked some button. ' 
                    + 'New URL is ' + this.getCurrentUrl(), 'info');
          
               /*
                * Wait for something to appear or change on-screen before 
                * proceeding.
                */
               casper.waitFor(function waitForPostBody() {
                    return this.evaluate(function evaluatePostBody() {
                          return document.querySelector('#something') !== null;
                    });
               }
               , function then() {
                    mikeTestUtils.screenCapture(mikeTestCtx.testCase
                         , 'post-body.png');
          
                    /*
                     * Test the POST body sent to the server when the button was 
                     * clicked.
                     */
                    this.test.assert(this.evaluate(function evaluatePostBody() {
                         var result = false;
                         _.each(globalMockedAjaxCalls, function(mockedCall) {
                              console.log('mockedCall = ' 
                                   + JSON.stringify(mockedCall));
                              if (mockedCall.url === 'rest-json/purchase' 
                                        && mockedCall.type === 'POST') 
                              {
                                   var requestData = JSON.parse(mockedCall.data);
                                   // Inspect and evaluate the requestData object.
                                   // If all is as expected, set result to true.
                              }
                         });
          
                         return result;
                    }));
               });
          });

          casper.run(function runTest() {
               this.log('Test finishing', 'info');

               this.test.done();
          });
     }
});
