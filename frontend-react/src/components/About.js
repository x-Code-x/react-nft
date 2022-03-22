import MysterBox from "../img/Logo.png";

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
          At Mystery, we're not only giving back directly and proportionally to our holders, we're giving those who may not have the means to move markets an opportunity at doing so. Through our Mystery Box giveaways, we're raising the bar for giving back to the community. This allows us to simultaneously should our full appreciation for our hodlers while giving Mystery real use-case.
          Mystery Box order of operations are simple: upon buying into the giveaway using Mystery tokens, you're afforded the opportunity to unlock some of the biggest prizes crypto has ever seen.
          Because Mystery is looking out for every one of it's hodlers, no Mystery Box buyer leaves empty handed: Flights, hotel stays, sporting event tickets, and crypto make up just a few of our giveaways.
        </h2>

       <div className="is-flex is-flex-wrap-wrap is-justify-content-center mb-6 custom-mobile-margin">
          <figure className="image is-96x96 mr-2 custom-mobile-img">
            <img src={Beaver} />
          </figure>
        </div>
      </section>

      <section className="section pt-0">
        <div className="is-flex is-justify-content-center is-align-items-center is-flex-wrap-wrap">
          <div>
            <figure className="image custom-about-img">
              <img src={MysterBox} />
            </figure>
          </div>
          <div className="custom-about-text p-5">
            <h1 className="title">More Details</h1>
            <p className="pb-2 custom-smaller-mobile-text">
              More stuff here. View the
              entire project code at this
              <a href="https://github.com/nmfretz" target="_blank">
                {" "}
                github repository.
              </a>{" "}
              Verified smart contract code is also viewable on BSC Scan{" "}
              <a href="#" target="_blank">
                here
              </a>
              .
            </p>
            <p className="pb-2 custom-smaller-mobile-text">
              The Mystery Box smart contract follows the ERC1155 Non-Fungible Token Standard. Development details
              are as follows:
            </p>
            <ul className="custom-details-list custom-smaller-mobile-text">
              <li>Inherits from OpenZeppelin's ERC721Enumerable and Ownable interfaces.</li>
              <li>
                Inherits from Chainlink's VRFConsumerBase to obtain verifiable random numbers on-chain and assign a
                random Myster Box with the result.
              </li>
              <li>Metadata and images are stored on IPFS and pinned using Pinata.</li>
            </ul>
          </div>
        </div>

        <div className="is-flex is-justify-content-center is-align-items-center is-flex-wrap-wrap">
          <div className="custom-about-text p-5">
            <h1 className="title">Mystery Box Details</h1>
            <p className="pb-2 custom-smaller-mobile-text">
              More stuff here.
            </p>
            <p>
              The specific Mystery Box you mint is determined during the minting process, using{" "}
              <a href="https://docs.chain.link/docs/chainlink-vrf/" target="_blank">
                Chainlink's VRF
              </a>{" "}
              to introduce randomness.
            </p>
          </div>
          <div>
            <figure className="image custom-about-img">
              <img src={MysterBox} />
            </figure>
          </div>
        </div>
        <div className="is-flex is-justify-content-center">
          <button className="button" onClick={mintPageHandler}>
            Ready to unlock a Mystery Box?
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
