const express = require('express');
const router = express.Router();

// Require the controllers
const registerlogin = require('../Controller/registerlogin');
const walletOperation = require('../Controller/walletOperation')

// *** register user ***
router.post('/register',registerlogin.register);

// *** Login user ***
router.post('/login',registerlogin.login);

// *** verify otp ***
router.post("/verify",registerlogin.verify);

// create a new accounts for ETH and BNB
router.post('/createAccount', walletOperation.createAccount);

// check balance of ETH and BNB
router.get('/ethbalance',walletOperation.checkETHbalance);

// check balance of BNB
router.get('/bnbalance',walletOperation.checkBNBbalance);

// transaction of ETH from one account to another
router.post('/ETHtransaction',walletOperation.ETHtransaction);

// transaction of BNB from one account to another
router.post('/BNBtransaction',walletOperation.BNBtransaction);

// *** Address show API ***
router.get('/showAddress',walletOperation.showAddress);

// show history of transaction
router.get('/history',walletOperation.alltransction);

// *** User profile API with verify by Json Web Token  ***
router.get('/Userprofile',registerlogin.Userprofile);

//*** dashboard API return address and currency and balance ***
router.get('/dashboard',walletOperation.dashboard);

module.exports = router;
