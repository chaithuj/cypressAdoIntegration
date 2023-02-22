import {Given} from 'cypress-cucumber-preprocessor/steps'
import {HomePage} from '../pages/page_actions/home'

Given('User click on Utilities',()=>{
    HomePage.clickOnUtilities()
})