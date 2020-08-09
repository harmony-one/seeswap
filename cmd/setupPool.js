require('dotenv').config()
const bn = require('bn.js')
var BN = (val) => new bn(val)

let initHmy = require('./createHmy')

const tokenJson = require("../contracts/ERC20.json")
const contractJson = require("../contracts/BPool.json")

const contractAddr = "0x8902d5f97c7992631134ced8ed8c16e4f09bfef2"
const tokenA = '0x7a791E76BF4d4f3b9B492AbB74E5108180bE6B5a'
const tokenB = '0x493c9d4362fB4FD1D0C17a6ECad08de33Fc1d8C2'

const unit = BN(10).pow(BN(18))

const bindAmount = BN(50000).mul(unit)
const tokenWeight = 1

let gasOptions = { gasPrice: 1000000000, gasLimit: 6721900 };

async function getPoolData(hmy) {
  let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

  let resp = await contract.methods.getController().call(gasOptions)
  console.log('Pool Controller: ' + JSON.stringify(resp))

  resp = await contract.methods.getNumTokens().call(gasOptions)
  console.log('Number of tokens bound to pool: ' + resp.toNumber())

  resp = await contract.methods.getCurrentTokens().call(gasOptions)
  console.log('Pool tokens: ' + JSON.stringify(resp))

  resp = await contract.methods.getSwapFee().call(gasOptions)
  console.log('Swap fee: ' + resp.toNumber())

  resp = await contract.methods.isFinalized().call(gasOptions)
  console.log('Finalized pool: ' + JSON.stringify(resp))
}

async function getTokenWeight(token, hmy) {
  let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

  let resp = await contract.methods.getNormalizedWeight(token).call(gasOptions)
  console.log('Token weight: ' + resp.toNumber())
}

async function approveToken(token, amount, hmy) {
  let tokenContract = hmy.contracts.createContract(tokenJson.abi, token)

  let resp = await tokenContract.methods.approve(contractAddr, amount).send(gasOptions)
  if (resp.status === 'called') {
    console.log('Token approved: ' + token)
  } else {
    console.log('Token approval failed: ' + token)
  }

  resp = await tokenContract.methods.allowance(hmy.wallet.accounts[0], contractAddr).call(gasOptions)
  console.log(resp.toString())
}

async function bindToken(token, amount, hmy) {
  let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

  let resp = await contract.methods.bind(token, amount, tokenWeight).send(gasOptions)
  if (resp.status === 'called') {
    console.log('Token bound: ' + token)
  } else {
    console.log('Token binding failed.')
  }
}

async function finalizePool(hmy) {
  let contract = hmy.contracts.createContract(contractJson.abi, contractAddr)

  let resp = await contract.methods.finalize().send(gasOptions)
  if (resp.status === 'called') {
    console.log('Pool finalized')
  } else {
    console.log('Finalize failed.')
  }
}

initHmy(process.env.MNEMONIC).then((hmy) => {
  getPoolData(hmy).then(() => {
    return approveToken(tokenA, bindAmount, hmy)
  }).then(() => {
    return bindToken(tokenA, bindAmount, hmy)
  }).then(() => {
    return approveToken(tokenB, bindAmount, hmy)
  }).then(() => {
    return bindToken(tokenB, bindAmount, hmy)
  }).then(() => {
    return finalizePool(hmy)
  }).then(() => {
    return getPoolData((hmy))
  }).then(() => {
    return getTokenWeight(tokenA, hmy)
  }).then(() => {
    return getTokenWeight(tokenB, hmy)
  }).then(() => {
    process.exit(0)
  })
})