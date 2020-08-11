require('dotenv').config()
const bn = require('bn.js')
var BN = (val) => new bn(val)

let initHmy = require('./createHmy')

const contractJson = require("../contracts/BPool.json")
const contractAddr = process.env.POOL

const tokenJson = require("../contracts/ERC20.json")
const tokenA = process.env.TOKEN_NAME1
const tokenAAddr = process.env.TOKEN_ADDR1
const tokenB = process.env.TOKEN_NAME2
const tokenBAddr = process.env.TOKEN_ADDR2

const unit = BN(10).pow(BN(18))

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

const yargs = require('yargs');
const argv = yargs.option('token', {
    alias: 't',
    description: 'Token to join the pool with (1SEED, 1LINK)',
    type: 'string'
}).option('amount', {
    alias: 'n',
    description: 'Amount to add',
    type: 'string'
}).help().alias('help', 'h').argv;

if (argv.token == null || argv.amount == null) {
    console.log("Arguments are invalid, please make sure you have specified all of the options")
    process.exit(1)
}

async function joinPool(token, name, amount, hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    let resp = await contract.methods.joinswapExternAmountIn(token, amount, 0).send(gasOptions)
    if (resp.status === "called") {
        console.log('Pool joined with ' + amount + ' '  + name + '.')
    } else {
        console.log('[ERROR] Failed to join pool')
    }
}

async function approveToken(token, name, amount, hmy) {
    let tokenContract = hmy.contracts.createContract(tokenJson.abi, token)

    let resp = await tokenContract.methods.approve(contractAddr, amount).send(gasOptions)
    if (resp.status === 'called') {
        console.log(name + ' transfer approved: ' + amount)
    } else {
        console.log('[ERROR] Token transfer approval failed. Please check balance.')
        process.exit(0)
    }
}

const convertedAmount = BN(argv.amount).mul(unit)

initHmy().then((hmy) => {
    if (argv.token === '1LINK') {
        approveToken(tokenAAddr, tokenA, convertedAmount, hmy).then(() => {
            return joinPool(tokenAAddr, tokenA, convertedAmount, hmy)
        }).then(() => {
            process.exit(0)
        })
    } else if (argv.token === '1SEED') {
        approveToken(tokenBAddr, tokenB, convertedAmount, hmy).then(() => {
            return joinPool(tokenBAddr, tokenB, convertedAmount, hmy)
        }).then(() => {
            process.exit(0)
        })
    } else {
        console.log('[ERROR] token must be either 1SEED or 1LINK')
        process.exit(0)
    }
})
