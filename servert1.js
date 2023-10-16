const TelegramBot = require('node-telegram-bot-api');
const token = '6575874378:AAEv8IUNxmIN1tqUQIj6yCNScyvOe06ztEE';
const bot = new TelegramBot(token, { polling: true });
const { ethers, JsonRpcProvider, Interface } = require('ethers');
const YOUR_INFURA_PROJECT_ID = '9ca1af07007a4463b2a3a3bacb7cafc6';

const provider = new JsonRpcProvider(`https://goerli.infura.io/v3/${YOUR_INFURA_PROJECT_ID}`);
const iface = new Interface([
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
]);

var msgi;
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
            //const tx = await provider.getTransaction(txHash);
            const receipt = await provider.getTransactionReceipt(txHash);
            var chatId;
            if (receipt.contractAddress) {
                console.log('New contract deployed at address:', receipt.contractAddress);
                chatId = msgi.chat.id;
                bot.sendMessage(chatId,`New contract deployed at address:${receipt.contractAddress}`);
                const contract = new ethers.Contract(receipt.contractAddress, iface, provider);
                contract.on('Transfer', (from, to, value) => {
                    if (contract != null) {
                        console.log(contract)
                    }
                    chatId = msgi.chat.id
                    bot.sendMessage(chatId,`ERC20 deployed at address:${contract}`);
                    console.log('--- ERC-20 Transfer Event ---\n');
                    console.log('From:', from, '\n');
                    console.log('To:', to, '\n');
                    console.log('Value:', value.toString(), '\n');
                    console.log('-----------------------------\n');
                });
            }
        }
    }
};
bot.onText(/start/, async (msg, match) => {
    msgi=msg
    monitorNewContracts()
});