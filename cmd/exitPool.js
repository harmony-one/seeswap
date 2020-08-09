require('dotenv').config()
const BigNumber = require('bignumber.js');

let initHmy = require('./createHmy')

const contractJson = require("../contracts/BPool.json")
const contractAddr = process.env.POOL

const tokenA = process.env.TOKEN_NAME1
const tokenAAddr = process.env.TOKEN_ADDR1
const tokenB = process.env.TOKEN_NAME2
const tokenBAddr = process.env.TOKEN_ADDR2

const unit = new BigNumber(1e18)

const maxAmount = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

const yargs = require('yargs');
const argv = yargs.option('token', {
    alias: 't',
    description: 'Token to give to the pool (1SEED, 1LINK)',
    type: 'string'
}).option('amount', {
    alias: 'n',
    description: 'Amount to swap',
    type: 'float'
}).help().alias('help', 'h').argv;

if (argv.token == null || argv.amount == null) {
    console.log("Arguments are invalid, please make sure you have specified all of the options")
    process.exit(1)
}

async function exitPool(token, name, amount, hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    let resp = await contract.methods.exitswapExternAmountOut(token, '0x' + amount.toString(16), maxAmount).send(gasOptions)
    if (resp.status === "called") {
        console.log('Successfully withdrew ' + amount.toFixed() + ' ' + name + ' from pool.')
    } else {
        console.log('[ERROR] Failed to withdraw from pool.')
    }
}

const convertedAmount = new BigNumber(argv.amount).multipliedBy(unit)

initHmy().then((hmy) => {
    if (argv.token === '1LINK') {
        exitPool(tokenAAddr, tokenA, convertedAmount, hmy).then(() => {
            process.exit(0)
        })
    } else if (argv.token === '1SEED') {
        exitPool(tokenBAddr, tokenB, convertedAmount, hmy).then(() => {
            process.exit(0)
        })
    } else {
        console.log('[ERROR] sendToken must be either 1SEED or 1LINK')
        process.exit(0)
    }
})