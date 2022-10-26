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
    cy.registerNewEmailAddress()
    cy.get('#booking-total-cost > strong > .price > .amount')
      .should(($el) => {
        let newTotalPrice = parseFloat($el.text())
        expect(newTotalPrice).to.equal(totalPrice)
      })
    cy.fillOutCustomerInformation(customer)
    cy.addProtectionPlan()
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
