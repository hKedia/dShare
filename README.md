## Local Setup

### Dowloading dependencies

1. Clone the repo using `git clone` and `cd` into the folder
2. Run `npm install` to download all the dependencies

### Compiling the smart contract

1. `cd` into the `ethereum` folder and run `node compile.js`

Above command will compile the contract using `solc` and outputs the `json` files under `ethereum/build`

### Deploying the smart contract to Rinkeby

Before deploying the contract, you need to set the `WALLET SEED` and the `RINKEBY` network url inside the file `ethereum/deploy.js`

The `WALLET SEED` is the 12 word mnemonic phase for your wallet.
The `RINKEBY` network url can be obtained by signing up at Infura.io

Once the values are set run `node depoloy.js` under `ethereum` folder.

When the contract is successfully deployed, above command console logs the contract address of the newly deployed contract.

Note this contract address as this needs to be set in the `.env` file

### Process environment variables

Rename `.env.default` to `.env` and supply the necessary values

Ethereum Config\
`RINKEBY_URL=`The rinkeby api url obtained from Infura.io\
`FACTORY_CONTRACT_ADDRESS=`The address where the contract is deployed

Firebase Config\
`API_KEY=`\
`AUTH_DOMAIN=`\
`DATABASE_URL=`\
`PROJECT_ID=`\
`STORAGE_BUCKET=`\
`MESSAGING_SENDER_ID=`

OriginStamp Config\
`ORIGINSTAMP_API_KEY=`Key for calling OriginStamp API. It can be obtained from [OriginStamp.org](https://originstamp.org/dev)

### Running in `dev` mode

In the root directory run `npm run dev` to start the application in development mode

### Running in `production` mode

In the root directory run `npm run build` to build the application

Once the build process is complete, run `npm run start` to start the application in production mode

### Testing

For testing, `mocha` is used

In the root directory run `npm run test` to run all the tests