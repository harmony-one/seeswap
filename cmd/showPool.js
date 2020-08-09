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

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

async function getPoolData(hmy) {
    let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

    console.log('Pool address: ' + contractAddr)

    let resp = await contract.methods.getBalance(tokenAAddr).call(gasOptions)
    let temp = new BigNumber(resp.toString())
    console.log(tokenA + ' tokens available: ' + temp.dividedBy(unit).toFixed())

    // resp = await contract.methods.getNormalizedWeight(tokenAAddr).call(gasOptions)
    // console.log(tokenA + ' weight: ' + resp.toNumber())

    resp = await contract.methods.getBalance(tokenBAddr).call(gasOptions)
    temp = new BigNumber(resp.toString())
    console.log(tokenB + ' tokens available: ' + temp.dividedBy(unit).toFixed())

    // resp = await contract.methods.getNormalizedWeight(tokenBAddr).call(gasOptions)
    // console.log(tokenB + ' weight: ' + resp.toNumber())

    resp = await contract.methods.getSpotPrice(tokenAAddr, tokenBAddr).call(gasOptions)
    temp = new BigNumber(resp.toString())
    console.log('Spot price (' + tokenA + ' -> ' + tokenB +'): ' + temp.dividedBy(unit).toFixed())

    resp = await contract.methods.getSpotPrice(tokenBAddr, tokenAAddr).call(gasOptions)
    temp = new BigNumber(resp.toString())
    console.log('Spot price (' + tokenB + ' -> ' + tokenA +'): ' + temp.dividedBy(unit).toFixed())

    resp = await contract.methods.getSwapFee().call(gasOptions)
    temp = new BigNumber(resp.toString())
    console.log('Swap fee: ' + temp.dividedBy(unit).toFixed())
}

initHmy().then((hmy) => {
    getPoolData(hmy).then(() => {
        process.exit(0)
    })
})