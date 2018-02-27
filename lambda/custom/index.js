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
const HELP_MESSAGE = 'You can say what is the lumen price, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye have a stellar time!';
const imageObj = {
    smallImageUrl: 'https://s3.amazonaws.com/gregor-misc/stellar-rocket.png',
    largeImageUrl: 'https://s3.amazonaws.com/gregor-misc/stellar-rocket.png'
};

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
            const speechOutput = "The current lumen price is: " + apiResult["price_usd"] + " dollars. A change of  " + apiResult["percent_change_24h"] + "% in the last 24 hours.";
            this.response.speak(speechOutput)
                .cardRenderer(SKILL_NAME, speechOutput, imageObj);
            this.emit(':responseReady');
        }); 
    },
    'GetLumenPriceBtcIntent': function () {
        getRequest(crypto, (apiResult) => {
            const speechOutput = "The current lumen price is: " + apiResult["price_btc"] + " bitcoin.";
            this.response.speak(speechOutput)
                .cardRenderer(SKILL_NAME, speechOutput, imageObj);
            this.emit(':responseReady');
        }); 
    },
    'ConvertLumensToDollars': function () {
        var amount_lumens = this.event.request.intent.slots.amount.value;
        getRequest(crypto, (apiResult) => {
            var amount_dollars = amount_lumens * apiResult["price_usd"]
            const speechOutput = amount_lumens + " lumens is " + amount_dollars + "dollars." ;
            this.response.speak(speechOutput)
                .cardRenderer(SKILL_NAME, speechOutput, imageObj);
            this.emit(':responseReady');
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

var event_json = {
    "version": "1.0",
    "session": {
        "new": true,
        "sessionId": "amzn1.echo-api.session.56e59c51-f15c-491b-a744-7e3062a3af7b",
        "application": {
            "applicationId": "amzn1.ask.skill.c4d033e6-fb53-4bbb-8e0a-ec8dbfd640fc"
        },
        "user": {
            "userId": "amzn1.ask.account.AGZ4EO5N5SX5OQQ2EQRHUDWDVBQFVEZ6NMIP2CQSTSXOH35HBVFICJKYV55YRHCKHT6FLIM2ID232UT65GPHQ5UYYO2RDT7OEFUNAJKHEGBFVGIJMY6QG3ECTZGVLVCQYK5UYHIH2SX36OSOOFA3WHSJINPA5J4Y3UKRWR42SB2PTJD7DSDO5KGF5XYUIBVEZW35TEHJKEINDZQ"
        }
    },
    "context": {
        "AudioPlayer": {
            "playerActivity": "IDLE"
        },
        "Display": {
            "token": ""
        },
        "System": {
            "application": {
                "applicationId": "amzn1.ask.skill.c4d033e6-fb53-4bbb-8e0a-ec8dbfd640fc"
            },
            "user": {
                "userId": "amzn1.ask.account.AGZ4EO5N5SX5OQQ2EQRHUDWDVBQFVEZ6NMIP2CQSTSXOH35HBVFICJKYV55YRHCKHT6FLIM2ID232UT65GPHQ5UYYO2RDT7OEFUNAJKHEGBFVGIJMY6QG3ECTZGVLVCQYK5UYHIH2SX36OSOOFA3WHSJINPA5J4Y3UKRWR42SB2PTJD7DSDO5KGF5XYUIBVEZW35TEHJKEINDZQ"
            },
            "device": {
                "deviceId": "amzn1.ask.device.AF6DBC42KSHVOAPO4XVRC2GCNM4I2H3GN3STOSK5ZCRDLTXDNIVKWNCPVJDR4JLEP35PUYCFOBWDOCEDJA2L2KMW6EHGYXJ6BKXPFL75DAQLR7YDPA2IARSR7E3TMQFKELDFJMFN3HXE2S2V5IKSINZW6PYQ",
                "supportedInterfaces": {
                    "AudioPlayer": {},
                    "Display": {
                        "templateVersion": "1.0",
                        "markupVersion": "1.0"
                    }
                }
            },
            "apiEndpoint": "https://api.amazonalexa.com",
            "apiAccessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJhdWQiOiJodHRwczovL2FwaS5hbWF6b25hbGV4YS5jb20iLCJpc3MiOiJBbGV4YVNraWxsS2l0Iiwic3ViIjoiYW16bjEuYXNrLnNraWxsLmM0ZDAzM2U2LWZiNTMtNGJiYi04ZTBhLWVjOGRiZmQ2NDBmYyIsImV4cCI6MTUxOTc1OTM0OCwiaWF0IjoxNTE5NzU1NzQ4LCJuYmYiOjE1MTk3NTU3NDgsInByaXZhdGVDbGFpbXMiOnsiY29uc2VudFRva2VuIjpudWxsLCJkZXZpY2VJZCI6ImFtem4xLmFzay5kZXZpY2UuQUY2REJDNDJLU0hWT0FQTzRYVlJDMkdDTk00STJIM0dOM1NUT1NLNVpDUkRMVFhETklWS1dOQ1BWSkRSNEpMRVAzNVBVWUNGT0JXRE9DRURKQTJMMktNVzZFSEdZWEo2QktYUEZMNzVEQVFMUjdZRFBBMklBUlNSN0UzVE1RRktFTERGSk1GTjNIWEUyUzJWNUlLU0lOWlc2UFlRIiwidXNlcklkIjoiYW16bjEuYXNrLmFjY291bnQuQUdaNEVPNU41U1g1T1FRMkVRUkhVRFdEVkJRRlZFWjZOTUlQMkNRU1RTWE9IMzVIQlZGSUNKS1lWNTVZUkhDS0hUNkZMSU0ySUQyMzJVVDY1R1BIUTVVWVlPMlJEVDdPRUZVTkFKS0hFR0JGVkdJSk1ZNlFHM0VDVFpHVkxWQ1FZSzVVWUhJSDJTWDM2T1NPT0ZBM1dIU0pJTlBBNUo0WTNVS1JXUjQyU0IyUFRKRDdEU0RPNUtHRjVYWVVJQlZFWlczNVRFSEpLRUlORFpRIn19.Lwynwy8YSt8ZcquzSxhCNdZ1SOHgYM_jxRYJ2c0sAwQ_GlVCXwaoxO9jxEE3mVTG3qd1o7AziDLSK879h-WTxSNZPHWVXp2SPcpBOcQh-EndMzaSvfPHhub__ml07Ej0X1zhC2jLtev27xEMWkeohpjqB3Zk60GsffqOPRvpl1fDHpiETI7ES-8nBQI2-aUJxu4qzOgzW4bLh0RGSsbQ6UTtsR3UzTW1A7tMRC0o0CrYxjBN4NFrEtzr_sTkP9IuGDx9ReHB8izIFhUqiALx6CDhIL34u8dyaros_lzzTzoo1SqtROvuxikPr4cY_58NDtPsBRWDh8EHMsJVCjX83Q"
        }
    },
    "request": {
        "type": "IntentRequest",
        "requestId": "amzn1.echo-api.request.470bb395-14f2-4181-8376-3979403d2a76",
        "timestamp": "2018-02-27T18:22:28Z",
        "locale": "en-US",
        "intent": {
            "name": "ConvertLumensToDollars",
            "confirmationStatus": "NONE",
            "slots": {
                "amount": {
                    "name": "amount",
                    "value": "5",
                    "confirmationStatus": "NONE"
                }
            }
        }
    }
}




