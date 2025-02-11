/* eslint-disable import/no-dynamic-require */
'use strict';
const router = require('express').Router()
const request = require('request')
const { parseString } = require('xml2js')
const objectMapper = require('../services/objectMapper')
const util = require('util')
const logger = require('../util/log')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 400 error catch
router.get("/", (req, res) => {
  logger.error(res);
  res.status(400).send({
    code: 0,
    reason: "Missing Mandatory Input Parameter"
  });
});


// router.get('/test', (req, response) => {
router.get('/individualaccount', (req, response) => {

  var filter = '', value = null;

  if (req.query === undefined || req.query === null) {
    return response.status(500).send({
      code: 0,
      reason: "No query parameter set"
    });
  } else {
    var url = ""
    if (req.query['contactmedium.characteristic.emailaddress']) {
      filter = 'PartyRole.PartyElectronicAddress.etrncAddr'
      var email = req.query['contactmedium.characteristic.emailaddress']
      url = process.env.MDM_URL_PREFIX + filter + '=' + `'${email}'` + process.env.MDM_URL_OUTPUT
    }

    else if (req.query['account.id']) {
      filter = `PartyRole.PartyIdentifiers.altIdTyp='BAN' AND PartyRole.PartyIdentifiers.altIdVal`
      var ban = req.query['account.id']
      url = process.env.MDM_URL_PREFIX + filter + '=' + `'${ban}'` + process.env.MDM_URL_OUTPUT
    }
    else if (req.query['contactMedium.characteristic.phoneNumber']) {
      filter = `PartyRole.PartyPhone.phnNum`
      var phoneNumber = req.query['contactMedium.characteristic.phoneNumber']
      url = process.env.MDM_URL_PREFIX + filter + '=' + `'${phoneNumber}'` + process.env.MDM_URL_OUTPUT
    }
  }
  
  request.get({
    uri: url,
    auth: {
      username: process.env.MDM_USERNAME,
      password: process.env.MDM_PASSWORD,
    },
    agentOptions: {
      rejectUnauthorized: false
    }
  }, function (err, httpResponse, body) {
    if (err) {
      return response.status(500).send({
        
        code: 0,
        reason: err // "Exception from the backend - request error"
      });
    }
    try {
      if (JSON.parse(body).item.length < 1) {
        return response.status(200).json([])
      }else {
        var result_array = []
        var items = JSON.parse(body).item /// [0].xGetPartyView
        for( var element of items) {
          const party = objectMapper.objectMapper(element.xGetPartyView)
          result_array.push(party);
        }
        return response.json(result_array)
      }
    } catch (e) {
      console.log(e)
      return response.status(500).send({
        code: 0,
        reason: "Exception from the backend - catch error"
      });
    }
  })
})



module.exports = router
