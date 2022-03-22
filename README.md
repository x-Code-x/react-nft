Mystery Box NFT - Solidity, Hardhat, React

# Development

### Smart Contract

Deploy smart contract to a localhost hardhat network:

```
cd smart-contract-hardhat
npx hardhat node
npx hardhat run scripts/deploy_localhost.js --network localhost
```

### Frontend React App

Start frontend with react-app

```
cd frontend-react
npm run start
```

Make sure to import correct correct contract abi to `App.js` from `contracts/`

Make sure to use the correct `DERPIES_ADDRESS` variable in `constants.js` for development:

- Comment out `const DERPIES_ADDRESS = process.env.REACT_APP_DERPIES_ADDRESS_RINKEBY;`
- Uncomment `const DERPIES_ADDRESS = process.env.REACT_APP_DERPIES_ADDRESS_LOCALHOST;`

# Deployment

### Smart Contract

Smart contract deployed to the Ethereum Rinkeby testnet at contract address 0xFae806Ef5fDadCBa0db4716228EC625d1FC64196. View verified contract at https://rinkeby.etherscan.io/address/0xFae806Ef5fDadCBa0db4716228EC625d1FC64196

Deploy smart contract to the ethereum rinkeby testnet:

```
cd smart-contract-hardhat
npx hardhat node
npx hardhat run scripts/deploy_rinkeby.js --network rinkeby
```

### Frontend

Front end currently deployed to netlify at https://whoopsiederpies.netlify.app/.

Make sure to import correct correct contract abi to `App.js` from `contracts/`

Make sure to use the correct `DERPIES_ADDRESS` variable in `constants.js` for deployment:

- Comment out `const DERPIES_ADDRESS = process.env.REACT_APP_DERPIES_ADDRESS_LOCALHOST;`
- Uncomment `const DERPIES_ADDRESS = process.env.REACT_APP_DERPIES_ADDRESS_RINKEBY;`

Build the frontend for production with `npm run build`. Deploy the `build` folder.

### Attribution

Forked from https://github.com/nmfretz/whoopsie-derpies-nft <- Love your work, your awesome
