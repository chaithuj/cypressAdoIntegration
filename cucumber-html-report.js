const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');


/* Method to get OS name like windows, linux, ubuntu */

const mapos = (os) => {
    if (os.startsWith('win')) {
        return 'windows';
    } else if (os.startsWith('linux')) {
        return 'linux';
    } else if (os.startsWith('ubuntu')) {
        return 'ubuntu';
    }
}


/*Method to generate cucumber html report*/

fs.readFile('report/run/results.json', function read(err, data) {
    if (err) {
        throw err;
    }
    var runInfos = JSON.parse(data);
    report.generate({
        jsonDir: "report/Jsonfile",
        reportPath: "./report/cucumberReport",
        metadata: {
            browser: {
                name: runInfos.browserName,
                version: runInfos.browserVersion
            },
            device: "Cypress",
            platform: {
                name: mapos(runInfos.osName)
            },
        },
        customData: {
            title: 'Run info',
            data: [
                { label: 'Project', value: 'test' },
                { label: 'Execution Start Time', value: new Date(runInfos.startedTestsAt).toLocaleString() },
                { label: 'Execution End Time', value: new Date(runInfos.endedTestsAt).toLocaleString() },
                { label: 'Execution Time', value: (((new Date(runInfos.endedTestsAt).getTime() - new Date(runInfos.startedTestsAt).getTime()) / 1000) / 60).toLocaleString() + "min" },
            ]
        }
    })
})