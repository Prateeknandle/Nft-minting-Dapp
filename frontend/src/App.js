import React, { useEffect,useState } from "react";
import './App.css';
import {ethers} from "ethers"
import myEpicNft from './utils/MyEpicNFT.json'

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;


function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [nftminted, setnftminted] = useState(0);


  const checkIfWalletIsConnected=async()=>{
    const {ethereum} = window;
    if(!ethereum){
      console.log("Make sure you have metamask!");
    }
    else{
      console.log("We have the ethereum object", ethereum);
    }

  const accounts = await ethereum.request({ method: 'eth_accounts' });
  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log("Found an authorized account:", account);
    setCurrentAccount(account);
    // Setup listener! This is for the case where a user comes to our site
    // and ALREADY had their wallet connected + authorized.
    setupEventListener()
  } else {
    console.log("No authorized account found");
  }
  let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);

// String, hex code of the chainId of the Rinkebey test network
const rinkebyChainId = "0x4"; 
if (chainId !== rinkebyChainId) {
	alert("You are not connected to the Rinkeby Test Network!");
}
}

const connectWallet=async()=>{
  try {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0]); 
    // Setup listener! This is for the case where a user comes to our site
    // and connected their wallet for the first time.
    setupEventListener() 
    getTotalNFTsMintedSoFar()
  }catch(error){
    console.log(error)
  }
}

 // Setup our listener.
const setupEventListener = async () => {
  const CONTRACT_ADDRESS = "0x478261f63c855b2A3437Ce8900ce98c7eFC7379E";
  try {
    const { ethereum } = window;

    if (ethereum) {
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      // This will essentially "capture" our event when our contract throws it.
      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber())
        alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
      });

      console.log("Setup event listener!")

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}

const getTotalNFTsMintedSoFar = async => {
  const CONTRACT_ADDRESS = "0x478261f63c855b2A3437Ce8900ce98c7eFC7379E";
  
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);// creates connection to our contract

      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        setnftminted(tokenId.toNumber());
        console.log(tokenId.toNumber())
      });

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x478261f63c855b2A3437Ce8900ce98c7eFC7379E";
  
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);// creates connection to our contract
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
  
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  const renderNotConnectedContainer = () => (
    (!currentAccount?
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
    :
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connected
    </button>
    )
  );

  useEffect(()=>{
    checkIfWalletIsConnected();
  },[])
  return (
    <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header gradient-text">My NFT Collection</p>
        <p className="sub-text">
          Each unique. Each beautiful. Discover your NFT today.
        </p>
        
        {renderNotConnectedContainer()}
        <br/>
        <br/>
        {currentAccount === "" 
    ? renderNotConnectedContainer()
    : (
      /** Add askContractToMintNft Action for the onClick event **/
      <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
    )
  }
  <h3>{nftminted}/50 NFT are minted.</h3>
      </div>
      <div className="footer-container">
        {/* <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} /> */}
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built on @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
);
};

export default App;