let url
class print {

    static clickPrintButtonAndVerifyCall() {
        cy.window().then((win) => {
            cy.spy(win, 'open').as('openTab')
        })
        cy.xpath('xpath').click()
        cy.get('@openTab', { timeout: 10000 }).its('args').then((args) => {
            url = args[0]
            url = url[0]
        })
        cy.get('@openTab').should('be.called')
    }

    static downloadPrintFile(){
        cy.downloadFile(url,'cypress/downloads','test.pdf')
    }

    static verifyExportcontent(content){
        cy.task('getPdfContent','test.pdf').then((fileContent)=>{
            expect(fileContent.text).to.contain(content)
        })
    }
}