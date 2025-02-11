
function objectMapper(partyItem) {
  const party = {}
  try {
    party.id = findId(partyItem)
    party['@type'] = 'InvidualAccount'
    party['@baseType'] = 'individual'
    party['@schemaLocation'] = 'stoplight URL where swagger for individual is'
    party.givenName = partyItem.frstNm ? partyItem.frstNm : "";
    party.familyName = partyItem.lstNm ? partyItem.lstNm : "";
    party.fullName = partyItem.fullNm ? partyItem.fullNm : "";
    party.contactMedium = mapContactMedium(partyItem)
    party.account = mapAccount(partyItem)

  } catch (error) {

  }
  return party
}

function findId(partyItem) {

  try {

    var partyIdentifiers = partyItem.PartyRole.item[0].PartyIdentifiers.item

    for (var identifier of partyIdentifiers) {
      var key = identifier.altIdTyp.idTyp
      var value = ''
      if (key == 'GID') {
        value = identifier.altIdVal
      }
      else {
        value = ""
      }
    }
    return value

  } catch (e) {
    console.log(e)
  }
}

function mapContactMedium(partyItem) {
  try {
    let array = []
    let telecom = {}

    telecom.mediumType = 'TelephoneNumber'
    try {
      let telecomObject = {}
      telecomObject.contactType = partyItem.PartyRole.item[0].PartyPhone.item[0].phnTyp.phnTyp
      telecomObject.phoneNumber = partyItem.PartyRole.item[0].PartyPhone.item[0].phnNum

      telecom.characteristic = telecomObject
      array.push(telecom)

    } catch (e) {

    }

    try {
      let email = {}
      email.mediumType = 'EMAIL'

      let emailObject = {}
      emailObject.emailAddress = partyItem.PartyRole.item[0].PartyElectronicAddress.item[0].etrncAddr
      email.characteristic = emailObject

      array.push(email)
    } catch (e) {

    }
    return array

  } catch (e) {
    console.log(e)
  }
}

function mapAccount(partyItem) {

  try {

    let accountArray = []
    var party_accounts = partyItem.PartyRole.item[0].PartyAccount.item
    for (var party_account of party_accounts) {
      let account = {}

      var commonPath = party_account.Account
      //console.log(commonPath['xAcctNum']);
      account.id = commonPath['xAcctNum'];
      account['@type'] = "AccountManagement_v1/BillingAccount";
      account['@baseType'] = "AccountManagement/BillingAccount";
      account['@schemaLocation'] = "{swagger location - tbd}";
      account.name = 'Customer Billing Account'
      account.brandId = commonPath.xBrandId.xBrandId;
      account.masterSrcId = commonPath.xAcctMstrSrcId;
      account.accountType = commonPath.xAcctTypCd.xAcctTypCd;
      account.accountStatus = commonPath.xAcctStatusCd.xAcctStatusCd;
      account.accountSubType = commonPath.xAcctSubtypCd;
      if (commonPath.xAcctMstrSrcId === "1001" && commonPath.xAcctSubtypCd.xAcctSubtypCd !== undefined) {
        account.accountSubType = "RI"
      } else {
        account.accountSubType = commonPath.xAcctSubtypCd.xAcctSubtypCd
      }
      account.contact = []
      let contact = {}
      contact.contactMedium = []
      try {
        let contactMediumobj = {}

        contactMediumobj.mediumType = 'PostalAddress'

        let contactMediumCharactersticObject = {}
        var contactPath = partyItem.PartyRole.item[0].PartyPostalAddr.item[0].PostalAddress

        contactMediumCharactersticObject.street1 = contactPath.addrLn1;
        contactMediumCharactersticObject.city = contactPath.city;
        contactMediumCharactersticObject.stateOrProvince = contactPath.state.stateCd;
        contactMediumCharactersticObject.postcode = contactPath.pstlCd;
        contactMediumobj.characteristic = contactMediumCharactersticObject;
        contact.contactMedium.push(contactMediumobj)
        account.contact.push(contact)

      } catch (e) {

      } 
      accountArray.push(account)


    }

    return accountArray;
  } catch (e) {
    console.log(e)
  }
}


module.exports = { objectMapper }
