var NodeRSA = require("node-rsa");
var pubkey = "-----BEGIN PUBLIC KEY-----";
pubkey += "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCuyZxd4GCkDui/XXxw8k/YoSUK";
pubkey += "5gDwbVdPtl9FkUvpWD7IgxP3iU+OOuivp9a30C/VWsialCVlQoGIgCdZwydvFirR";
pubkey += "qguUkbgvfDuOW1JaH7LYC3qb4+h/YDxX6Ulf1IbvJYiKViFeDizGSfc4MhbZsRhq";
pubkey += "W7vyoXhDc/HO6ZaTWQIDAQAB";
pubkey += "-----END PUBLIC KEY-----";
var generateKeyPair = function(message,time) {
	var encrypted='';
		if(time !=new Date()){
			encrypted='';
		}

	message=message+''+parseInt(Date.now()/1000);
  let clientKey = new NodeRSA(pubkey);
  clientKey.setOptions({ encryptionScheme: "pkcs1" });
   encrypted = clientKey.encrypt(message, "base64");
  return encrypted;
};

export default generateKeyPair;
