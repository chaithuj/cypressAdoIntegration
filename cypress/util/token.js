/* Method to generate JWT token  */

class auth_token_provider {
    static async auth_token() {
        var test = Cypress.env('test')
        const data = await cy.request({
            method: "POST", url: Cypress.env('tokenURl') , body: {
                "grant_type": "client_credentials",
                'test': test
            },
            headers: "{'headers':'header'}"
        })
        return data.body['access_token']
    }
} export { auth_token_provider };