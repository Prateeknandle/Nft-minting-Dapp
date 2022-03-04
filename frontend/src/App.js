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
  } else {
    console.log("No authorized account found");
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
  }catch(error){
    console.log(error)
  }
}
  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x24D9d9895399565c062843052A51FbD1038700C4";
  
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
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
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