import Image from "../img/nft_img/Image.png";
import Myster from "../img/myster-beta-tone.png";
import Logo from "../img/Logo.png";
import { PROJECT_NAME, NETWORK, NFT_NAME } from "../constants";

const About = ({ setSelectedTab }) => {
  function mintPageHandler() {
    setSelectedTab("Mint");
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
  }

  return (
    <div className="background">
      <section className="section has-text-centered pb-0 container">
        <h1 className="inter pb-6">ABOUT</h1>
        <h2 className="subtitle pb-6 mb-0 custom-smaller-mobile-text">
          {PROJECT_NAME} is an NFT project deployed to the <strong>{NETWORK}</strong>.
          At {PROJECT_NAME}, we're not only giving back directly and proportionally to our holders, we're giving those who may not 
          have the means to move markets an opportunity at doing so. Through our {NFT_NAME} giveaways, we're raising the 
          bar for giving back to the community. This allows us to simultaneously show our full appreciation for our hodlers 
          while giving {PROJECT_NAME} real use-case.
          {PROJECT_NAME} order of operations are simple: upon buying into the giveaway using {PROJECT_NAME} tokens, you're afforded 
          the opportunity to unlock some of the biggest prizes crypto has ever seen.
          Because {PROJECT_NAME} is looking out for every one of it's hodlers, no {NFT_NAME} buyer leaves empty 
          handed: Flights, hotel stays, sporting event tickets, and crypto make up just a few of our giveaways.
          View minted collection on{" "}
          <a href="https://testnets.opensea.io/collection/whoopsiederpies" target="_blank">
            Some Platform ({NETWORK})
          </a>
          .
        </h2>

        <div className="is-flex is-flex-wrap-wrap is-justify-content-center mb-6 custom-mobile-margin">
          <figure className="image is-96x96 mr-2 custom-mobile-img">
            <img src={Myster} />
          </figure>
          <figure className="image is-96x96 mr-2 custom-mobile-img">
            <img src={Logo} />
          </figure>
          <figure className="image is-96x96 mr-2 custom-mobile-img">
            <img src={Logo} />
          </figure>
          <figure className="image is-96x96 mr-2 custom-mobile-img">
            <img src={Myster} />
          </figure>
        </div>
      </section>

      <section className="section pt-0">
        <div className="is-flex is-justify-content-center is-align-items-center is-flex-wrap-wrap">
          <div>
            <figure className="image custom-about-img">
              <img src={Myster} />
            </figure>
          </div>
          <div className="custom-about-text p-5">
            <h1 className="title">More Details</h1>
            <p className="pb-2 custom-smaller-mobile-text">
              More stuff here.
              Verified smart contract code is also viewable on {NETWORK}{" "}
              <a href="https://rinkeby.etherscan.io/address/0xFae806Ef5fDadCBa0db4716228EC625d1FC64196" target="_blank">
                here
              </a>
              .
            </p>
            <p className="pb-2 custom-smaller-mobile-text">
              The {PROJECT_NAME} smart contract follows the ERC1155 Non-Fungible Token Standard. Development details
              are as follows:
            </p>
            <ul className="custom-details-list custom-smaller-mobile-text">
              <li>Inherits from OpenZeppelin's ERC1155Enumerable and Ownable interfaces.</li>
              <li>
                Inherits from Chainlink's VRFConsumerBase to obtain verifiable random numbers on-chain and assign a
                random animal with the result.
              </li>
              <li>Metadata and images are stored on IPFS and pinned using Pinata.</li>
            </ul>
          </div>
        </div>

        <div className="is-flex is-justify-content-center is-align-items-center is-flex-wrap-wrap">
          <div className="custom-about-text p-5">
            <h1 className="title">{NFT_NAME} Details</h1>
            <p className="pb-2 custom-smaller-mobile-text">
              A total of (n) {NFT_NAME} can be minted on-chain. There are (n) unique {NFT_NAME}s that it is possible to
              mint: Class Names go here.
            </p>
            <p>
              The specific {NFT_NAME} you mint is determined during the minting process, using{" "}
              <a href="https://docs.chain.link/docs/chainlink-vrf/" target="_blank">
                Chainlink's VRF
              </a>{" "}
              to introduce randomness.
            </p>
          </div>
          <div>
            <figure className="image custom-about-img">
              <img src={Logo} />
            </figure>
          </div>
        </div>
        <div className="is-flex is-justify-content-center">
          <button className="button" onClick={mintPageHandler}>
            Ready to Mint a {NFT_NAME}?
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
