const NodeRSA = require('node-rsa');
const config = require('config');
const logger = require('winston');
const x509 = require('x509.js');

module.exports = (req, res, next, publicKey, TOKEN_EXPIRE_MILLI) => {
  const encrypted = req.headers[config.get('security.tokenName')];
  logger.debug("token: " + encrypted);
  
  let decrypted;
  if (!encrypted) {
    return res.status(401).json({ status: {statusCd: '401', statusTxt: 'Unauthorized: NO TOKEN telus_atn_token' }});
  }

  try {
    //parse x509 cert
    const parsedKey = x509.parseCert(publicKey);

    let rsa = new NodeRSA();
    rsa.importKey({
        n: Buffer.from(parsedKey.publicModulus, 'hex'),
        e: parseInt(parsedKey.publicExponent, 16)
    }, 'components-public');

    //Decrypt token
    const decrypted = rsa.decryptPublic(encrypted);
    const decryptedObj = JSON.parse(decrypted);

    //Validate token expiration date
    if (decryptedObj.timestamp === undefined || Date.now() > (parseInt(decryptedObj.timestamp) + parseInt(TOKEN_EXPIRE_MILLI))){
      logger.debug("Unauthorized: Invalid token: " + JSON.stringify(decryptedObj));
      return res.status(401).json({ status: {statusCd: '401', statusTxt: 'Unauthorized: Invalid token' }});
    }
    next();
  } catch (ex) {
      logger.debug("Unauthorized: Invalid token: " + ex.message);
      return res.status(401).json({ status: {statusCd: '401', statusTxt: 'Unauthorized: Invalid token' }});
  }
};