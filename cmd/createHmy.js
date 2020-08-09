require('dotenv').config()

const { Harmony } = require('@harmony-js/core')
const { ChainID, ChainType } = require('@harmony-js/utils')

function createHmy() {
    let hmy = new Harmony(process.env.ENDPOINT,
        {
            chainType: ChainType.Harmony,
            chainId: ChainID.HmyMainnet,
        },
    )
    const wallet = hmy.wallet.addByPrivateKey(process.env.PRIVATE_KEY)
    hmy.wallet.setSigner(wallet.address)
    return hmy
}

async function setSharding(hmy) {
    const res = await hmy.blockchain.getShardingStructure();
    hmy.shardingStructures(res.result);
}

module.exports = async function () {
    const hmy = createHmy()
    await setSharding(hmy)
    return hmy
}
