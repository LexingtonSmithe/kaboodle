// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Wait for iframe to load, and call callback
 *
 * Some hints taken and adapted from:
 * https://gitlab.com/kgroat/cypress-iframe/-/blob/master/src/index.ts
 */
 /**
 * Will check if an iframe is ready for DOM manipulation. Just listening for the
 * load event will only work if the iframe is not already loaded. If so, it is
 * necessary to observe the readyState. The issue here is that Chrome initialises
 * iframes with "about:blank" and sets their readyState to complete. So it is
 * also necessary to check if it's the readyState of the correct target document.
 *
 * Some hints taken and adapted from:
 * https://stackoverflow.com/questions/17158932/how-to-detect-when-an-iframe-has-already-been-loaded/36155560
 *
 * @param $iframe - The iframe element
 */
const isIframeLoaded = $iframe => {
  const contentWindow = $iframe.contentWindow;

  const src = $iframe.attributes.src;
  const href = contentWindow.location.href;
  if (contentWindow.document.readyState === 'complete') {
    return href !== 'about:blank' || src === 'about:blank' || src === '';
  }

  return false;
};
Cypress.Commands.add('registerNewEmailAddress', () => {
  cy.get('[data-test="input-registration-email"]')
    .type(randomString(8) + "@mailinator.com")
  cy.get('[data-test="button-registration-form-submit"]')
    .click()
})
Cypress.Commands.add('addProtectionPlan', () => {
  cy.get('.col-sm-12 > .btn')
    .click()
  cy.get('[data-test="KBF-protection-plan-yes-label"]')
    .click()
})

Cypress.Commands.add('manuallyEnterAddress', (customer) => {
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
})



Cypress.Commands.add('fillOutCustomerInformation', (customer) => {
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
  cy.manuallyEnterAddress(customer)
})

Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframes => new Cypress.Promise(resolve => {
  const loaded = [];

  $iframes.each((_, $iframe) => {
    loaded.push(
      new Promise(subResolve => {
        if (isIframeLoaded($iframe)) {
          subResolve($iframe.contentDocument.body);
        } else {
          Cypress.$($iframe).on('load.appearHere', () => {
            if (isIframeLoaded($iframe)) {
              subResolve($iframe.contentDocument.body);
              Cypress.$($iframe).off('load.appearHere');
            }
          });
        }
      })
    );
  });

  return Promise.all(loaded).then(resolve);
}));


Cypress.Commands.add('fillOutCreditCardForm', details => {
  cy.get('.__PrivateStripeElement > iframe')
    .iframe()
    .then(iframes => {
      cy.wrap(iframes[0])
        .find('.InputElement')
        .first()
        .type(details.number);
      cy.wrap(iframes[1])
        .find('.InputElement')
        .first()
        .fill(
          moment()
            .add(5, 'years')
            .format('MM/YY')
        );
      cy.wrap(iframes[2])
        .find('.InputElement')
        .first()
        .fill(details.cvv);
  });
});

function randomString(length){
  let text = "";
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < length; i++)
    text += letters.charAt(Math.floor(Math.random() * letters.length));
  return text;
}
