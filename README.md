## SeeSWAP

Balancer demo on Harmony

#### Requirements
`Node v12+` & `npm`

#### Setup
With Docker (recommended):
```bash
docker pull harmonyone/seeswap
docker run -it harmonyone/seeswap
# follow steps to setup, then you can run commands as follows:
seeswap <command> <option>
# For example
seeswap checkBalance
seeswap joinPool -t 1SEED -n 100
seeswap swapToken -s 1SEED -r 1LINK -n 100
# To see all commands do:
seeswap help
```

Without Docker (not recommended):
```bash
git clone https://github.com/harmony-one/seeswap.git
cd seeswap
npm install
./setup.sh
```
`setup.sh` will prompt you to input your wallet's private key

#### Commands

##### Check Balances
```$xslt
node ./cmd/checkBalance.js
```

##### See Pool Information
```$xslt
node ./cmd/showPool.js
```
Swap price is displayed with no fee.

##### Swap Tokens
```$xslt
node ./cmd/swapTokens.js -s [token to send] -r [token to receive] -n [amount]

node ./cmd/swapTokens.js -s 1SEED -r 1LINK -n 100
```

##### Join Pool
```$xslt
node ./cmd/joinPool.js -t [token to join with] -n [amount]

node ./cmd/joinPool.js -t 1SEED -n 100
```

##### Exit Pool
```$xslt
node ./cmd/exitPool.js -t [token to join with] -n [amount]

node ./cmd/exitPool.js -t 1SEED -n 100
```

#### FAQ

```$xslt
Q: How do I fix an error?

A: Please check your available balances & available balances in the pool
```
