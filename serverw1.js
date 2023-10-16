// client.messages
//         .create({
//             body: 'Your appointment is coming up on July 21 at 3PM',
//             from: 'whatsapp:+14155238886',
//             to: 'whatsapp:+917678491455'
//         })
//         .then(() => {
//             console.log('Response sent successfully');
//             res.status(200).send('Response sent successfully');
//         })
//         .catch(error => {
//             console.error('Error sending response:', error);
//             res.status(500).send('Error sending response');
//         });
// const {Web3} = require('web3');
const accountSid = 'ACad4982304550f6389a43adff302ff771'; // Obtain from your Twilio account
const authToken = '644348d5644b5bc349a5aa464711963a';   // Obtain from your Twilio account

const client = require('twilio')(accountSid, authToken);


const { ethers, JsonRpcProvider, Interface } = require('ethers');
const YOUR_INFURA_PROJECT_ID = '9ca1af07007a4463b2a3a3bacb7cafc6';

const provider = new JsonRpcProvider(`https://goerli.infura.io/v3/${YOUR_INFURA_PROJECT_ID}`);
const iface = new Interface([
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
]);

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

            if (receipt.contractAddress) {
                console.log('New contract deployed at address:', receipt.contractAddress);
                client.messages
                    .create({
                        body: `New contract deployed at address:${receipt.contractAddress}`,
                        from: 'whatsapp:+14155238886',
                        to: 'whatsapp:+919644170599'
                    })
                    .then(message => console.log('Message sent successfully:', message.sid))
                    .catch(err => console.error('Error sending message:', err));

                const contract = new ethers.Contract(receipt.contractAddress, iface, provider);
                contract.on('Transfer', (from, to, value) => {
                    if (contract != null) {
                        console.log(contract)
                    }
                    console.log('--- ERC-20 Transfer Event ---\n');
                    console.log('From:', from, '\n');
                    console.log('To:', to, '\n');
                    console.log('Value:', value.toString(), '\n');
                    console.log('-----------------------------\n');

                    client.messages
                        .create({
                            body: `ERC20 deployed at address:${contract} with reciept:\n${receipt}`,
                            from: 'whatsapp:+14155238886',
                            to: 'whatsapp:+919644170599'
                        })
                        .then(message => console.log('Message sent successfully:', message.sid))
                        .catch(err => console.error('Error sending message:', err));
                });
            }
        }
    }
};

monitorNewContracts();