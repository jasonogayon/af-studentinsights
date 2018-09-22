# STUDENT INSIGHTS TESTS #

## Overview

1. [Clone the project](#clone-the-project)
2. [Install test dependencies](#install-test-dependencies)
3. [Run tests](#run-tests)
4. [Test report](#test-report)
5. [Demo Video](#demo-video)

___

## Clone the project

Please make sure that you have the following tools installed in your machine:

* [Git](https://git-scm.com/downloads)
* [NodeJS](https://nodejs.org/en/download/)

To check if said tools are installed, run `git --version`, `node -v`, and `npm -v` and see if versions of each are displayed.

![alt text](https://github.com/jasonogayon/af-studentinsights/raw/master/images/af-dependencies-1.png "Check Tool Installations")

Clone the project by running:

~~~~
git clone https://github.com/jasonogayon/af-studentinsights.git
~~~~

And then go inside the project directory:

~~~~
cd af-studentinsights
~~~~

---

## Install test dependencies

* [Cypress](https://www.cypress.io/)
* [Mochawesome](https://www.npmjs.com/package/mochawesome)

To install test dependencies, run the following:

~~~~
npm install
~~~~

For this 12-hour quick task it was more important to focus on exploring the application and writing the scripts for the given stories. It was necessary to not lose time in test tool setup. The tool should be something that is user-friendly for both devs and managers. And it would be great if it has reporting and video recording built-in too. For these reasons I chose [Cypress](https://www.cypress.io/).

---

## Run tests

Run tests by running the following command:

~~~~
npm test
~~~~

---

## Test report

Sample HTML test report (using `mochawesome`) inside the `mochawesome-report` directory (which includes a zip file of the report):

![alt text](https://github.com/jasonogayon/af-studentinsights/raw/master/images/af-results-html-1.png "Mochawesome HTML Test Report")

Test report as displayed on a terminal:

![alt text](https://github.com/jasonogayon/af-studentinsights/raw/master/images/af-results-terminal-1.png "Cypress Terminal Test Report No. 1")
![alt text](https://github.com/jasonogayon/af-studentinsights/raw/master/images/af-results-terminal-2.png "Cypress Terminal Test Report No. 2")

You can also run the tests on Cypress's user interface. Open Cypress by running:

~~~
npm run cy
~~~

![alt text](https://github.com/jasonogayon/af-studentinsights/raw/master/images/af-cypress-1.png "Cypress UI No. 1")

Clicking `studentinsights.js` will run the tests and the report on the UI looks something like this:

![alt text](https://github.com/jasonogayon/af-studentinsights/raw/master/images/af-cypress-2.png "Cypress UI No. 2")

---

## Demo video

A video recording of the tests is automatically recorded when the `npm test` command is executed and is saved inside the `cypress/videos` directory.

<a href="http://www.youtube.com/watch?feature=player_embedded&v=Iym99Yn_Wy4
" target="_blank"><img src="http://img.youtube.com/vi/Iym99Yn_Wy4/0.jpg"
alt="Demo Cypress Video" width="240" height="180" border="10" /></a>
