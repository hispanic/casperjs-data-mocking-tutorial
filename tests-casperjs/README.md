tests-casperjs
==============

From the top-level tests-casperjs directory, you can run the suite of CasperJS tests with the following command:

    casperjs.bat test --includes=_pre-each-test-file.js test-cases

(Just drop the .bat if you aren’t running on Windows. For Windows users, I’ve found that CasperJS runs very nicely via Cygwin.)

With this command, by default, CasperJS is going to run every script it finds in the test-cases directory. So, our “test suite” becomes every script in our target directory. Simple, but it works.
