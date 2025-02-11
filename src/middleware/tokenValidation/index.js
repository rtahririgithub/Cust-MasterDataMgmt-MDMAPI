const tokenValidation = require('./utils/tokenValidation');
const getCertificate = require('./utils/getCertificate');
const logger = require('winston');
const config = require('config');

const TOKEN_EXPIRE_MILLI = 5 * 60 * 1000; // 5 minutes

module.exports = (req, res, next) => {
  if(config.get('security.enabled') 
      && (Array.isArray(config.get('security.protectedList')) && config.get('security.protectedList').findIndex((s) => { 
        if(s == "/" || req.url.startsWith(config.get('server.contextPath') + s)) return true;
      }) > -1)){
    const publicKey = getCertificate(config.get('security.basekeypath'), process.env.NODE_CONFIG_ENV);
    tokenValidation(req, res, next, publicKey, TOKEN_EXPIRE_MILLI);
  }else next();
};