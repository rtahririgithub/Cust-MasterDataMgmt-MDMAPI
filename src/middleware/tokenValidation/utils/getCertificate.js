const path = require('path');
const fs = require('fs');

let publicKey;

module.exports = (basekeypath, env) => {
  /* To generate the key pairs:
    openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:512
    openssl rsa -pubout -in private.pem -out public.pem
  */
  if (!publicKey) {
    const envDir = (env == 'pr')?'pr':'non-pr';
    const normalizePath = path.resolve(basekeypath, envDir, 'rest-token.pem');
    if(!fs.existsSync(normalizePath)) return
    publicKey = fs.readFileSync(normalizePath, 'utf8');
  }
  return publicKey;
};
