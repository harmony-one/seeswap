require('dotenv').config()
const BigNumber = require('bignumber.js');

let initHmy = require('./createHmy')

const contractJson = require("../contracts/BPool.json")
const contractAddr = process.env.POOL

const tokenJson = require("../contracts/ERC20.json")
const tokenA = process.env.TOKEN_NAME1
const tokenAAddr = process.env.TOKEN_ADDR1
const tokenB = process.env.TOKEN_NAME2
const tokenBAddr = process.env.TOKEN_ADDR2

const unit = new BigNumber(1e18)

const maxPrice = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

const yargs = require('yargs');
const argv = yargs.option('sendToken', {
    alias: 's',
    description: 'Token to give to the pool (1SEED, 1LINK)',
    type: 'string'
}).option('receiveToken', {
    alias: 'r',
    description: 'Token to receive from the pool (1SEED, 1LINK)',
    type: 'string'
}).option('amount', {
    alias: 'n',
    description: 'Amount to swap',
    type: 'float'
}).help().alias('help', 'h').argv;

if (argv.sendToken == null || argv.receiveToken == null || argv.amount == null) {
    console.log("Arguments are invalid, please make sure you have specified all of the options")
    process.exit(1)
}

async function swapToken(tokenSend, tokenReceive, amount, hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    // Set minAmountOut to 0 & maxPrice to very high
    let resp = await contract.methods.swapExactAmountIn(tokenSend, '0x' + amount.toString(16), tokenReceive, 0, maxPrice).send(gasOptions)
    if (resp.status === "called") {
        console.log('Swap successful.')
    } else {
        console.log('[ERROR] Swap failed.')
        process.exit(0)
    }
}

async function approveToken(token, name, amount, hmy) {
    let tokenContract = hmy.contracts.createContract(tokenJson.abi, token)

    let resp = await tokenContract.methods.approve(contractAddr, '0x' + amount.toString(16)).send(gasOptions)
    if (resp.status === 'called') {
        console.log(name + ' transfer approved: ' + amount)
    } else {
        console.log('[ERROR] Token transfer approval failed. Please check balance.')
        process.exit(0)
    }
}

const convertedAmount = new BigNumber(argv.amount).multipliedBy(unit)

initHmy().then((hmy) => {
    if (argv.sendToken === '1LINK') {
        approveToken(tokenAAddr, tokenA, convertedAmount, hmy).then(() => {
            return swapToken(tokenAAddr, tokenBAddr, convertedAmount, hmy)
        }).then(() => {
            process.exit(0)
        })
    } else if (argv.sendToken === '1SEED') {
        approveToken(tokenBAddr, tokenB, convertedAmount, hmy).then(() => {
            return swapToken(tokenBAddr, tokenAAddr, convertedAmount, hmy)
        }).then(() => {
            process.exit(0)
        })
    } else {
        console.log('[ERROR] sendToken must be either 1SEED or 1LINK')
        process.exit(0)
    }
})