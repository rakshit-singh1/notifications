const { ethers, JsonRpcProvider } = require('ethers');
const YOUR_INFURA_PROJECT_ID = '9ca1af07007a4463b2a3a3bacb7cafc6';

const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${YOUR_INFURA_PROJECT_ID}`);

const erc20ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
];
const monitorNewContracts = async () => {
    provider.on('block', async (blockNumber) => {
        console.log('New block received.\nBlock number:', blockNumber);
        await checkNewContracts(blockNumber);
    });
};

const checkNewContracts = async (blockNumber) => {
    const block = await provider.getBlock(blockNumber);
    if (block && block.transactions) {
        for (const txHash of block.transactions) {
            const receipt = await provider.getTransactionReceipt(txHash);
            if (receipt.contractAddress) {
                console.log('New contract deployed at address:', receipt.contractAddress);
                const contract = new ethers.Contract(receipt.contractAddress.toString(), erc20ABI, provider);
                try {
                    const name = await contract.name();
                    //console.log(name);
                    const symbol = await contract.symbol();
                    //console.log(symbol);
                    const totalSupply = await contract.totalSupply();
                    //console.log(totalSupply);

                    if (await name.length !=null && await symbol.length!=null && await totalSupply!=null) {
                        await console.log('--- ERC-20 Token Info ---');
                        await console.log('Contract Address:', receipt.contractAddress);
                        await console.log('Name:', name);
                        await console.log('Symbol:', symbol);
                        await console.log('Total Supply:', totalSupply);
                        await console.log('------------------------');
                    }
                } catch (error) {
                    console.log("Which is not an ERC20 contract")
                }
            }
        }
    }
};


monitorNewContracts();
