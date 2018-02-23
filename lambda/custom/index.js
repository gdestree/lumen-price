/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.c4d033e6-fb53-4bbb-8e0a-ec8dbfd640fc';

const https = require('https');
const url = "https://api.coinmarketcap.com/v1/ticker/";
const crypto = "stellar/";

const SKILL_NAME = 'Lumen Price';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye have a stellar time!';

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetLumenPriceDollarsIntent');
    },
    'GetLumenPriceDollarsIntent': function () {
        getRequest(crypto, (apiResult) => {
            const speechOutput = "The current lumen price on coinmarketcap.com is: " + apiResult["price_usd"] + " dollars.";
            this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
        }); 
    },
    'GetLumenPriceBtcIntent': function () {
        getRequest(crypto, (apiResult) => {
            const speechOutput1 = "The current lumen price on coinmarketcap.com is: " + apiResult["price_btc"] + " bitcoin.";
            this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
        }); 
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

// HELPER FUNCTIONS
function getRequest(crypto, callback) {
    var req = https.request((url + crypto), res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            var result = JSON.parse(returnData)[0];
            callback(result);
        });

    });
    req.end();
}
