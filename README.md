# Bounty Challenge: TokenBound Accounts

Token-bound account (TBA) grants all existing and future nonfungible tokens (NFTs) smart wallets. Allowing them to fully participate in the ecosystem as first-class citizens. This lets the NFT execute transactions on behalf of its owner, being an EOA or another contract. As an overview, the account once deployed is mapped to the token by a registry that will resolve its account address. This gives the impression that the token can hold assets when these are deposited onto the account bound to the token. Whoever holds the token will control the account and thereby all their assets within. The possibilities this unlocks are infinite, some examples are Network Playable Characters, assets aggregators, loot boxes, and cross-chain messaging systems.

This proposal utilizes the [registry](https://github.com/erc6551/reference/blob/main/src/ERC6551Registry.sol) and [accounts](https://github.com/tokenbound/contracts/blob/main/src/Account.sol) contracts provided by the token-bound team. The implementation is very good and completes all the requirements asked for this bounty and it's very well tested, we feel that there is no need to reinvent the wheel. The contract have already been deployed and they are ready to use on both Polygon and Avax chains.

Regarding bridges, they are not trivial, they account for the biggest [hacks](https://rekt.eth.link/) ever and they tend to happen frequently. This is due mostly to having multiple moving parts and a single point of failure, the gateway, that tends to hold the assets being bridged. There is no one perfect solution, but compromises need to be made. A bridge, like a blockchain, needs to be decentralized, secure, and fast. But it cannot be three things at once, in the case of gaming a good tradeoff would be to sacrifice somewhat decentralization to favor security and scalability. This gives more control to the developers and helps provide the best experience possible to gamers.

Most implementations will follow a similar structure, and they’ll vary in the way messages are being passed between chains. A gateway on the source chain will lock the token being bridged and the event will be emitted, the relayer network will validate the incoming message and if valid relay it to a destination chain. On the destination chain most likely the miner contract will be owned by the destination gateway, minting and grating to the provided receiver. As seen in the diagram following the black arrows.

![diagram](https://i.imgur.com/fjVHfTL.png)

Specifically, this proposal uses a simple server script that listens to events on one chain and forwards the message to the destination gateway. This is not meant for production, due to its very centralized nature, but there are ways to work around them. We’ve investigated multiple solutions and tried implementing [multiChai](https://multichain.org/). The impression is that current solutions come short of the expected latency a game needs. We believe that handling the transfer by internal tools today would give users the best experience.

Finally, we would like to mention an alternative to controlling bridge assets. Given that most likely gaming NFTs will be on L2 chains, due to them being cheaper and faster, more appropriate for gaming. But there are ways in which a token on an L1 can hold and control the assets on the L2. As an example, the registry on the destination(L2) chain, allows for the minting of accounts to NFTs on the source chain (L1), the gateway should be granted permission to interact with this account. This would allow for the relayer to pass calls onto the destination account coming from the source NFT.


## Setup

```bash
#Set up .env

RPC_URL_SRC=""
RPC_URL_DEST=""
PRODUCTION_MNEMONIC=""
ETHERSCAN_POLYGON=""
ETHERSCAN_AVALANCHE=""
```

```
cd cloned_repo && yarn
```
## Deploy
```bash
# Deploy source chain

yarn hardhat --network source deploy --tags src_nft
yarn hardhat --network source deploy --tags src_gateway

# Deploy destination chain
yarn hardhat --network destination deploy --tags dst_nft
yarn hardhat --network destination deploy --tags dst_gateway
```


## Execute

```bash
# Setup Relayer 
yarn hardhat run scrips/relayer.ts


# Running main script
yarn hardhat run scrips/1_mint_bridge.ts
```

## Executed transactions

1. [Mint source](https://polygonscan.com/tx/0xe54e7a7caac991ae029e3c31310ddbfbb6e6e5ab5ec562447350f5811b474495)

2. [Create account](https://polygonscan.com/tx/0xbc538735cc99f9c0b690419aa864342e88c10c5884fb5aa68f30d6b3de05f80f)

3. [Found account](https://polygonscan.com/tx/0x4e9df537c26bd09f43f048bccced2a26739036aa1c7ea81d88d37d4fb71d50d5)

4. [Lock at source gateway](https://polygonscan.com/tx/0xea9af9e26170de9e5491056ef83c442914ac0f93c82a4e1a3197d862ceebb2c6)

5. [Bridge at destination](https://snowtrace.io/tx/0xbf87587bb5d8c92259bdf984cf0cb4d3793d7d742976c9043065484aeed6a73b)

![cli](https://i.imgur.com/rjTALjM.gif)
