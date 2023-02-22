let plan_ID = 12345
let organization = "organization"
let project = "project"
let pat = "pat"

/*
Method to update in ADO test plan with screenshot
status: test case run status
screenshot: base64 converted value
suite ID: test case suite ID
tc ID: test case ID
comment: Comment on test (ex:-pass\fail reason comment)
*/

class ado_integration {

    static update_result(status, screenshot, suite_ID, tc_ID, comment) {
        try {
            let url_testPointID = "https://dev.azure.com/" + organization + "/" + project + "/_apis/test/plans/" + plan_ID + "/suites/" + suite_ID + "/points?testCaseld=" + tc_ID + "&api-version=5.0"
            cy.request({
                method: "GET", url: url_testPointID, auth: { username: '', password: pat }
            }).then(function (response) {
                let pointID = response.body['value'][0]['id']
                var d = new Date();
                var dformat = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') + '' + [d.getHours(), d.getMinutes().d.getSeconds()].join(':');
                let runName = "UI Automation " + dformat
                let url_createrun = "https://dev.azure.com/" + organization + "/" + project + "/apis/test/runs?api-version=5.0"
                let payload_createrun = '{"name":' + runName + '", "plan": { "id":' + plan_ID + '}, "pointIds": [' + pointID + "}}"
                cy.request({
                    method: "POST", url: url_createrun, body: payload_createrun, auth: {
                        username: '', password: pat
                    }, headers: { 'Content-Type': 'application/json' }
                }).then(function (response) {
                    let runID = response.body['id']
                    let url_editTestRun = "https://dev.azure.com/" + organization + "/" + project + "/_apis/test/runs/" + runID + "/results?api-version=6.0-preview.6"
                    cy.request({
                        method: "GET", url: url_editTestRun, auth: {
                            username: '', password: pat
                        }, headers: { 'Content-Type': 'application/json' }
                    }).then(function (response) {
                        let resultID = response.body['value'][0]['id']
                        let url = "https://dev.azure.com/" + organization + "/" + project + "/apis/test/runs/" + runID + "/results?api version=6.0-preview.6"
                        let payload
                        if (status == 'Passed') {
                            payload = '[{"id": ' + resultID + ', "outcome": "' + status + '", "state": "Completed", "comment": "' + comment + '"}]'
                        } else if (status == 'SKIPPED') {
                            payload = '[{"id":' + resultID + ', "outcome": "NotApplicable", "state": "Completed", "comment": "Test hass been skipped" }}'

                        } else {
                            payload = '[{"id":' + resultID + ', "outcome": "' + status + '", "state": "Completed", "comment": "' + comment + '"}]'
                        }
                        cy.request({
                            method: "PATCH", url: url, body: payload, auth: {
                                username: '', password: pat
                            }, headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function () {
                            addAttachment(runID, resultID, screenshot)
                        })
                    })
                })
            })
        } catch (error) {
            cy.log('Something went wrong in updating Test Results in ADO:' + error)
        }
    }
}
export { ado_integration }
/*
Method to update in ADO test plan for screenshot
*/
function addAttachment(runID, resultID, Stream) {
    try {
        let url = "https://dev.azure.com/" + organization + "/" + project + "/_apis/test/Runs/" + runID + "/Results/" + resultID + "/attachments?api-version-6.0-preview.1"
        let payloadJson = '{ "stream": "' + Stream + '", "fileName": "screenshot.png", "comment": "Test attachment uploaded", "attachmentType": "GeneralAttachment"}'
        cy.request({
            method: "POST", url: url, body: payloadJson, auth: {
                username: '', password: pat
            }, headers: {
                'Content-Type': 'application/json'
            }
        }).then(function () {
        })
    } catch (error) {
        cy.log('Something went wrong in uploading the attachment:' + error)
    }
}