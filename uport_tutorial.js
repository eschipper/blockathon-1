// Setup

const SimpleSigner = window.uportconnect.SimpleSigner
const Connect = window.uportconnect.Connect
const appName = 'UportTutorial'

const connect = new Connect('Marc\'s App voor WIGO4IT', {
  clientId: '2on6y285bcCdwFtuYipqoLTN2d95YrhW2Cc',
  network: 'rinkeby',
  signer: SimpleSigner('8277c714ab4e03d0c082004ab819c37495234cce74acd8169713c4bf1c927b07')
 });

const web3 = connect.getWeb3()

// Setup the simple Status contract - allows you to set and read a status string
const abi = [{"constant":false,"inputs":[{"name":"status","type":"string"}],"name":"updateStatus","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getStatus","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}]

const StatusContract = web3.eth.contract(abi);
const statusInstance = StatusContract.at('0x70A804cCE17149deB6030039798701a38667ca3B')

// uPort connect
const uportConnect = function () {
  connect.requestCredentials({
    requested: ['name', 'phone', 'country'],
    notifications: true // We want this if we want to recieve credentials
  })
  .then((credentials) => {
  // Do something
    console.log("Credenials:", credentials);
    globalState.uportId = credentials.address;
    globalState.uportName = credentials.name;
    globalState.uportCountry = credentials.country;
    globalState.uportPhone = credentials.phone;
    render();
    }, (err) => {
        console.log("Error:", err);
    })
}

// Send ether
const sendEther = () => {
  const value = parseFloat(globalState.sendToVal) * 1.0e18

  web3.eth.sendTransaction(
    {
      to: globalState.sendToAddr,
      value: value
    },
    (error, txHash) => {
      if (error) { throw error }
      globalState.txHashSentEth = txHash
      render()
    }
  )
}

// Set Status
const setStatus = () => {
  const newStatusMessage = globalState.statusInput
  statusInstance.updateStatus(newStatusMessage,
    (error, txHash) => {
      if (error) { throw error }
      globalState.txHashSetStatus = txHash
      render()
      })
}

// attest User
const attest = () => {
  var PROPERTY_VALUE = 'Lorem ipsum dolor sit amet';
  console.log(connect);
  connect.attestCredentials({
    sub: connect.clientId,
    claim: { 'claim': PROPERTY_VALUE },
  });
}