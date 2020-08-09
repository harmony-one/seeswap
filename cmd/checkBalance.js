require('dotenv').config()
const bn = require('bn.js')
var BN = (val) => new bn(val)

const { toBech32 } = require("@harmony-js/crypto");

let initHmy = require('./createHmy')

const tokenJson = require("../contracts/ERC20.json")
const tokenA = process.env.TOKEN_NAME1
const tokenAAddr = process.env.TOKEN_ADDR1
const tokenB = process.env.TOKEN_NAME2
const tokenBAddr = process.env.TOKEN_ADDR2

const unit = BN(10).pow(BN(18))

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 }

async function checkBalance(token, name, hmy) {
    let tokenContract = hmy.contracts.createContract(tokenJson.abi, token)

    let resp = await tokenContract.methods.balanceOf(hmy.wallet.accounts[0]).call(gasOptions)
    if (resp == null) {
        console.log('[ERROR] Unable to fetch balance.')
        process.exit(0)
    }
    let temp = BN(resp.toString())
    console.log(name + ' balance: ' + temp.div(unit))
}

async function getBalance(hmy) {
    let resp = await hmy.blockchain.getBalance({
        address: hmy.wallet.accounts[0],
    })
    if (resp == null) {
        console.log('[ERROR] Unable to fetch balance.')
        process.exit(0)
    }
    console.log('ONE: ' + new hmy.utils.Unit(resp.result).asWei().toEther())
}

initHmy().then((hmy) => {
    console.log('Wallet: ' + toBech32(hmy.wallet.accounts[0]))
    getBalance(hmy).then(() => {
        return checkBalance(tokenAAddr, tokenA, hmy)
    }).then(() => {
        return checkBalance(tokenBAddr, tokenB, hmy)
    }).then(() => {
        process.exit(0)
    })
})