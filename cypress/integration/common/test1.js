import {Given} from 'cypress-cucumber-preprocessor/steps'

Given('User hit the application',()=>{
    cy.visit(Cypress.env('url'))
})