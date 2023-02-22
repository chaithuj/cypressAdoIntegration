require('cypress-xpath')
import HomePageLocators from '../page_locators/home_page_locators' 
const home = new HomePageLocators()
class HomePage {

    static clickOnUtilities(){
        cy.get(home.tab_utilities).eq(0).click()
    }

} export {HomePage}