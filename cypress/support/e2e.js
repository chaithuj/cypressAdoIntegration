// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { ado_integration } from '../util/ado_integration'
import { auth_token_provider } from '../util/token'
// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(() => {
    console.log("before Each")
    // auth_token_provider.auth_token.then(function (JWTToken) {
    //     window.localStorage.setItem('JwtToken', JWTToken)
    //     crypto.window().then((win) => {
    //         win.sessionStorage.setItem(
    //             "key", JWTToken
    //         )
    //     })
    // })
})

afterEach(() => {
    let status = window.testState.runTests[window.testState.currentScenario.name]['result']
    if (status == 'passed' || status == 'failed') {
        const retries = cy.state('test').currentRetry()
        Cypress.Screenshot.default({ capture: 'viewport' })
        cy.screenshot()
        var screenshotsFolder = Cypress.config("screenshotsFolder");
        var testState = window.testState;
        var screenshotFileName = `${testState.currentScenario.name} -- after each hook.png`
        if ((Cypress.env('tags')) === undefined) {
            var testScreenshotFolder = `${screenshotsFolder}`
        } else {
            var testScreenshotFolder = `${screenshotsFolder}/${Cypress.spec.name}`
        }
        if (retries === 0) {
            cy.readFile(
                `${testScreenshotFolder}/${screenshotFileName}`, "base64"
            ).then((imageData) => {
                // updateTestResult(status, imageData)
            })
        } else {
            let screenshotFileName1 = `${testState.currentScenario.name} -- after each hook (attempt` + (retries+1) + `).pngs`
            cy.readFile(
                `${testScreenshotFolder}/${screenshotFileName1}`, "base64"
            ).then((imageData) => {
                // updateTestResult(status, imageData)
            })
        }
    }
    cy.clearCookies()
    cy.clearLocalStorage()
})

function updateTestResults(status, screenshot) {
    cy.fixture('ado_to_integration').then(function (data) {
        let test = data[(window.testState.uri).replaceAll('.feature', '') + '_' + window.testState.currentScenario.name]
        var suite_id, testcase_id
        if (test != undefined && test != null) {
            let testcases = test.split(',')
            testcases.forEach(testcase => {
                if (testcase !== undefined && testcase != null) {
                    suite_id = testcase.split(':')[0]
                    testcase_id = testcase.split(':')[1]
                    if (suite_id != undefined && suite_id != null && suite_id.length > 0 && testcase_id !== undefined && testcase_id != null && testcase_id.length > 0) {
                        if (status.toLowerCase() == "passed") {
                            status = 'Passed'
                            ado_integration.update_result(status, screenshot, suite_id, testcase_id, "Successful passed")
                        } else if (status.toLowerCase() == "failed") {
                            status = 'Failed'
                            let size = (window.testState.runTests[window.testState.currentScenario.name]).length
                            let comment
                            for (let i = 0; i < size; i++) {
                                if (window.testState.runTests[window.testState.currentScenario.name][i]['status'] = 'failed') {
                                    comment = (window.testState.runTests[window.testState.currentScenario.name][i]['exception']['message']).replaceAll("\"", "'")
                                    break;
                                }
                            }
                            ado_integration.update_result(status, screenshot, suite_id, testcase_id, comment)
                        } else {
                            status = 'skipped'
                        }
                    }
                }
            })
        }
    })
}