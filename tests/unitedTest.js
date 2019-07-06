module.exports = {

  'UnitedAirlinesFlightSearch'(browser) {

    browser
      .url('https://www.united.com')
      .waitForElementVisible('.app-components-BookFlightForm-bookFlightForm__primaryButton--2fg9l')
      .click('#oneway')
      .setValue('#bookFlightOriginInput', 'New York JFK')
      .waitForElementVisible('#bookFlightOriginInput-menu-item-0')
      .click('#bookFlightOriginInput-menu-item-0')
      .setValue('#bookFlightDestinationInput', 'Miami')
      .waitForElementVisible('#bookFlightDestinationInput-menu-item-0')
      .click('#bookFlightDestinationInput-menu-item-0')
      .click('#DepartDate')
      .click('td[aria-label="Tuesday, August 20, 2019"]')
      .click('#cabinType')
      .click('#cabinType_item-0')
      .click('.app-components-BookFlightForm-bookFlightForm__primaryButton--2fg9l')
      .waitForElementVisible('.tabbedFW-day', 25000)
      .click('#column-ECO-BASIC')
      .click('#a-results-show-all')
      .waitForElementVisible('.icon-toggle-arrow-up-gray-result')
      .pause(5000)

    var departTimes = []
    var arriveTimes = []
    var stops = []
    var durations = []
    var prices = []

    browser
      // flight-time-depart
      .elements('css selector', '.flight-time-depart', function (result) {
        result.value.map(function (element, err) {
          browser.elementIdAttribute(element.ELEMENT, 'innerText', function (x) {
            departTimes.push(x.value)
          })
        })
      })

      // flight-time-arrive
      .elements('css selector', '.flight-time-arrive', function (result) {
        result.value.map(function (element, err) {
          browser.elementIdAttribute(element.ELEMENT, 'innerText', function (x) {
            arriveTimes.push(x.value)
          })
        })
      })

      // stops
      .elements('css selector', '.connection-count', function (result) {
        result.value.map(function (element, err) {
          browser.elementIdAttribute(element.ELEMENT, 'innerText', function (x) {
            stops.push(x.value)
          })
        })
      })

      // flight-duration
      .elements('css selector', '.flight-duration', function (result) {
        result.value.map(function (element, err) {
          browser.elementIdAttribute(element.ELEMENT, 'innerText', function (x) {
            durations.push(x.value);
          }
          )
        })
      })

      // prices
      .elements('css selector', '.fare-option.use-roundtrippricing', function (result) {
        result.value.map(function (element, err) {
          browser.elementIdAttribute(element.ELEMENT, 'innerText', function (x) {
            if ((x.value.includes("Not available") || x.value.includes("$"))
              && x.value.includes("Basic Economy (most restricted)")) {
              prices.push(x.value)
            }
          })
        })
      })

      .perform(function () {
        var assert = require('assert')

        assert.equal(
          (departTimes.length + arriveTimes.length + stops.length + durations.length + prices.length) / 5
          , departTimes.length)

        var loopCounter = 0
        var includedFlights = 0
        var flightsList = {}
        var flights = []
        flightsList.flights = flights;

        for (loopCounter = 0; loopCounter < departTimes.length; loopCounter++) {
          if (!prices[loopCounter].includes("Not available")) {
            includedFlights++
            var flight = {
              "flightNo": loopCounter + 1,
              "departTime": departTimes[loopCounter].split('\n').join(' ').replace("Departing ", ""),
              "arriveTime": arriveTimes[loopCounter].split('\n').join(' ').replace("Arriving ", ""),
              "stops": stops[loopCounter],
              "duration": durations[loopCounter],
              "price": prices[loopCounter].split('\n').join(' ').replace(" fare for Basic Economy (most restricted)", ""),
            }
            flightsList.flights.push(flight)
          }
        }

        console.log(flightsList)
        console.log("Test was successful. Final amount of flights included: " + includedFlights + ", from " + departTimes.length + " found.")
      })

      .end();
  }
};