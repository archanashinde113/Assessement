const Web3 = require('web3');
const request = require('request');
const wallet = require('ethereumjs-wallet');
const web3 = new Web3("https://ropsten.infura.io/v3/9cc53a94cc4a42b793e399fd8b0d5755");
const web3_bnb = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const mongoose = require("mongoose");
const Account = require("../Models/account.model")
const dotenv = require('dotenv');
dotenv.config();
Private_Key = process.env.Private_Key;


module.exports = {
  // *** Crate Account ***
  createAccount: async (req, res) => {
    var addressDetail = wallet['default'].generate();
    console.log("address: " + addressDetail.getAddressString());
    console.log("privateKey: " + addressDetail.getPrivateKeyString());
    newAccount = new Account({
      addressData: addressDetail.getAddressString(),  
      private_Key: addressDetail.getPrivateKeyString()
    })
    newAccount.save(function (err, dbResponse) {
      if (err) {
        res.send(err);
      }
      console.log(dbResponse);
      res.send(newAccount);
    });
  },

  //  *** Check Balance of Etherium ***
  checkETHbalance: async function (req, res) {
    address = req.body.address;
    web3.eth.getBalance(address, async (err, result) => {
      if (err) {
        res.json(err);
        return;
      }
      let balance = web3.utils.fromWei(result, "ether");
      res.json(balance + " ETH");
    });
  },

  // *** check BNB Balance ***
  checkBNBbalance: async (req, res) => {
    const address = req.body.address;
    web3.eth.getBalance(address, async (err, result) => {
      if (err) {
        res.json(err);
        return;
      }
      let balance = web3.utils.fromWei(result);
      res.json(balance +  " BNB " );
    });
  },

  //   ***Transaction ETH from one account to another***
  ETHtransaction: async function (req, res) {
    const transaction_from = req.body.transaction_from;
    const transaction_to = req.body.transaction_to;
    const value = req.body.value;

    async function eth_transaction() {
      const value = web3.utils.toWei(req.body.value, 'ether')
      const SignedTransaction = await web3.eth.accounts.signTransaction({
        to: transaction_to, //process.env.to_address,
        value: value,
        gas: 200000,
        nonce: web3.eth.getTransactionCount(transaction_from)
      }, Private_Key);

      web3.eth.sendSignedTransaction(SignedTransaction.rawTransaction).then((receiptwallet) => {
        res.json(receiptwallet)

        const deatils = new Account({
          _id: new mongoose.Types.ObjectId(),
          transaction_from: transaction_from,
          transaction_to: transaction_to,
          transaction_hash: receiptwallet.transactionHash,
          value: value,
          Private_Key: Private_Key
        })
        deatils.save()
      })
    }
    eth_transaction();
  },

  //   ***Transaction BNB from one account to another***
  BNBtransaction: async function (req, res) {
    const transaction_from = req.body.transaction_from;
    const transaction_to = req.body.transaction_to;
    const value = req.body.value;
    const transaction_hash = req.body.transaction_hash;

    async function eth_transaction() {
      const value = web3.utils.toWei(req.body.value, 'ether')
      const SignedTransaction = await web3_bnb.eth.accounts.signTransaction({
        to: transaction_to, //process.env.to_address,
        value: value,
        gas: 5000000,
        gasPrice: 18e9,
        nonce: web3_bnb.eth.getTransactionCount(transaction_from)
      }, Private_Key);

      web3_bnb.eth.sendSignedTransaction(SignedTransaction.rawTransaction).then((receiptwallet) => {
        res.json(receiptwallet)

        const deatils = new receiptApi({
          _id: new mongoose.Types.ObjectId(),
          transaction_from: transaction_from,
          transaction_to: transaction_to,
          transaction_hash:receiptwallet.transactionHash,
          value: value,
          Private_Key: Private_Key
        })
        deatils.save()
      })
    }
    eth_transaction();
  },
// *** show address ***
showAddress: async function (req, res) {
  const addressData = req.query.addressData;
  var condition = addressData ? { addressData: { $regex: new RegExp(addressData), $options: "i" } } : {};
  Account.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving account Detail."
      });
    });
},

  // *** show transaction history ***
  alltransction: async function (req, res) {
    const address = req.body.address;
    const API_KEY = process.env.API_KEY;
    request(`https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${API_KEY}`, function (error, response, body) {
      console.error('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', JSON.parse(body));
      res.status(200).json(JSON.parse(body))
      const alltransactionSave = new Account(
        { alltransaction: JSON.parse(body) },
      );
      alltransactionSave.save();
    });
  },

// *** profile detail ***
profile: async (req, res) => {
  const addressData = req.query.addressData;
  var condition = addressData ? { addressData: { $regex: new RegExp(addressData), $options: "i" } } : {};
  Account.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving account Detail."
      });
    });
},
  // *** dashboard return address and balance and currency ***
  dashboard: async (req, res) => {
    let account = await Account.findOne()
    let address = account.addressData
    const ETH_Balance = await web3.eth.getBalance(address, async (err, result) => {
        if (err) {
          res.json(err);
          return;
        }
        let balance = web3.utils.fromWei(result);
        res.json(balance +  " BNB " );
      });
    
    const BNB_Balance = await web3.eth.getBalance(address, async (err, result) => {
      if (err) {
        res.json(err);
        return;
      }
        let balance = web3.utils.fromWei(result);
        res.json(balance +  " BNB " );
    });
    const dashboard_data = ({
          Address: address,
          currency: "ETH",
          Balance: ETH_Balance,
        },
        {
          Address:address,
          currency: "BNB",
          Balance: BNB_Balance
        } 
    )
    res.status(200).send(dashboard_data);
  },
}


