const CryptoJS = require('crypto-js');
require("dotenv").config();
const secretKey = process.env.AES_KEY;
const iv = process.env.AES_IV;
const encrypt = (text) => {
    const cipher = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(secretKey), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    })
    return cipher.toString()
};

const decrypt = (encryptedText) => {
    const cipher = CryptoJS.AES.decrypt(encryptedText, CryptoJS.enc.Utf8.parse(secretKey),
        {iv: CryptoJS.enc.Utf8.parse(iv)}
    )
    return cipher.toString(CryptoJS.enc.Utf8);
};

module.exports = {encrypt, decrypt}