import customer from '../fixtures/userData.json'

describe('New Customer Booking Flow', () => {
  it('Should add a ticket, and add new customer details', () => {
    let ticketPrice;
    let bookingFee;
    let totalPrice;
    let protectionPrice;
    cy.visit(Cypress.env('url'))
    cy.get('[data-ticket-id="47406"] > .ticket-counter > .spinner > .plus > .fa')
      .click()
      .click()
    cy.get('[data-ticket-id="47406"] > .ticket-labels > .ticket-label-desc > .display-price-value > .price > .amount')
      .then(($el) => {
        ticketPrice = parseFloat($el.text())
      })
    cy.get('[data-ticket-id="47406"] > .ticket-labels > .ticket-label-desc > .display-price-booking-fee > .price > .amount')
      .then(($el) => {
        bookingFee = parseFloat($el.text())
      })
    cy.get('strong > .price > .amount')
      .should(($el) => {
        totalPrice = parseFloat($el.text())
        expect(totalPrice).to.equal(ticketPrice*2 + bookingFee*2)
      })
    cy.get('[data-test=button-goto-next-stage]')
      .click()
    cy.get('[data-test="input-registration-email"]')
      .type(randomString(8) + "@mailinator.com")
    cy.get('[data-test="button-registration-form-submit"]')
      .click()
    cy.get('#booking-total-cost > strong > .price > .amount')
      .should(($el) => {
        let newTotalPrice = parseFloat($el.text())
        expect(newTotalPrice).to.equal(totalPrice)
      })
    cy.get('[data-test="input-details-first-name-1-input"]')
      .type(customer.firstName)
    cy.get('[data-test="input-details-last-name-1-input"]')
      .type(customer.lastName)
    cy.get('[data-test="pax-password-1-input"]')
      .type(customer.password)
    cy.get('[data-test="pax-confirm-password-1-input"]')
      .type(customer.password)
    cy.get('.wrapper-0-2-352 > .Select__control')
      .click()
    cy.get('[data-test="input-details-gender-1-Male"]')
      .click()
    cy.get('#pax-phone-number-1')
      .type(customer.telephoneNumber)
    cy.get('#day-pax-date-of-birth-1')
      .type(customer.dob.day)
    cy.get('#month-pax-date-of-birth-1')
      .type(customer.dob.month)
    cy.get('#year-pax-date-of-birth-1')
      .type(customer.dob.year)
    cy.get('.wrapper-0-2-152 > .Select__control > .Select__value-container')
      .click()
    cy.get('#react-select-3-option-0') //no data tag
      .should(($el)=> {
        expect($el).to.contain("United Kingdom")
      })
      .click()
    cy.get('.col-sm-12 > .btn') // no data tag
      .click()
    cy.get('[data-test="input-details-address-line-1-input"]')
      .type(customer.addressLineOne)
    cy.get('[data-test="input-details-address-city-input"]')
      .type(customer.city)
    //missing specific data tag for postcode
    //cy.get('.inputContainer-0-2-430 > [data-test="input-details-address-county-input"]')
    cy.get('.inputContainer-0-2-443 > [data-test="input-details-address-county-input"]')
      .type(customer.postcode)
    cy.get('.col-sm-12 > .btn')
      .click()
    cy.get('[data-test="KBF-protection-plan-yes-label"]')
      .click()
    cy.get('.protectionPlan__optionTitle-0-2-265 > .price > .amount')
      .then(($el) => {
        protectionPrice = parseFloat($el.text())
      })
    cy.get('#booking-total-cost > strong > .price > .amount')
      .should(($el) => {
        let newTotalPrice = parseFloat($el.text())
        //required to negate a js real number decimal point issue
        let totalPlusProtection = parseFloat((totalPrice + protectionPrice).toFixed(2))
        expect(newTotalPrice).to.equal(totalPlusProtection)
      })
    cy.get('.marketingConsent__containerLeft-0-2-302 > .checkbox-double > label') // no data tag
      .click()
    cy.get('.title-0-2-317') // no data tag
      .click()

    //cy.fillOutCreditCardForm({ number: customer.cardDetails.number, cvv: customer.cardDetails.cvv})
    // couldn't get this to work with the time limit I set myself for this task
  })
})

function randomString(length){
  let text = "";
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < length; i++)
    text += letters.charAt(Math.floor(Math.random() * letters.length));
  return text;
}
