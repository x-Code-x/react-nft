//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Derpies is ERC721Enumerable, Ownable, VRFConsumerBase {
  string public baseTokenURI;
  uint256 public maxSupply = 500;
  uint256 public price = 0.01 ether;
  bool public isSaleActive = false;

  bytes32 internal keyHash;
  uint256 internal fee;

  mapping(uint256 => uint256) public tokenIdToRandomizedDerpieId;
  mapping(uint256 => string) public randomizedDerpieIdToDerpieName;
  mapping(bytes32 => address) public randomNumberRequestIdToSender;
  mapping(bytes32 => uint256) public randomNumberRequestIdToTokenId;

  event RequestedDerpieMint(bytes32 indexed requestId, uint256 indexed tokenId);
  event MintedDerpie(address indexed minter, uint256 tokenId);
  event ReceiveFunctionExecuted(address, uint256);
  event FallbackFunctionExecuted(address, uint256);

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _baseTokenURI,
    address _vrfCoordinator,
    address _linkToken,
    bytes32 _keyHash,
    uint256 _fee
  ) ERC721(_name, _symbol) VRFConsumerBase(_vrfCoordinator, _linkToken) {
    keyHash = _keyHash;
    fee = _fee;
    setBaseURI(_baseTokenURI);
    _setDerpies();
  }

  function _setDerpies() private {
    randomizedDerpieIdToDerpieName[0] = "Beaver";
    randomizedDerpieIdToDerpieName[1] = "Bunny";
    randomizedDerpieIdToDerpieName[2] = "Cheetah";
    randomizedDerpieIdToDerpieName[3] = "Elephant";
    randomizedDerpieIdToDerpieName[4] = "Flamingo";
    randomizedDerpieIdToDerpieName[5] = "Fox";
    randomizedDerpieIdToDerpieName[6] = "Giraffe";
    randomizedDerpieIdToDerpieName[7] = "Hedgie";
    randomizedDerpieIdToDerpieName[8] = "Horsie";
    randomizedDerpieIdToDerpieName[9] = "Kitty";
    randomizedDerpieIdToDerpieName[10] = "Lemur";
    randomizedDerpieIdToDerpieName[11] = "Llama";
    randomizedDerpieIdToDerpieName[12] = "Narwhal";
    randomizedDerpieIdToDerpieName[13] = "Octopus";
    randomizedDerpieIdToDerpieName[14] = "Orca";
    randomizedDerpieIdToDerpieName[15] = "Piggie";
    randomizedDerpieIdToDerpieName[16] = "Rhinoceros";
    randomizedDerpieIdToDerpieName[17] = "Sandpiper";
    randomizedDerpieIdToDerpieName[18] = "Shark";
    randomizedDerpieIdToDerpieName[19] = "Squirrel";
  }

  function withdraw() public onlyOwner {
    uint256 _balance = address(this).balance;
    payable(msg.sender).transfer(_balance);
  }

  function setPrice(uint256 _newPrice) public onlyOwner {
    price = _newPrice;
  }

  function toggleIsSaleActive() public onlyOwner {
    isSaleActive = !isSaleActive;
  }

  function mintDerpie() public payable returns (bytes32 requestId) {
    require(isSaleActive, "Sale paused");
    uint256 tokenId = totalSupply(); // totalSupply() is _allTokens.length from ERC721Enumerable (therefor, functions as next tokenId due to zero-based array indexing)
    require(tokenId <= maxSupply - 1, "So very sorry - All Derpies have been minted"); // max supply of 500 derpies
    require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
    require(msg.value >= price, "Not enough Ether");

    requestId = requestRandomness(keyHash, fee); // makes initial request for randomness to Chainlink VRF
    randomNumberRequestIdToSender[requestId] = msg.sender;
    randomNumberRequestIdToTokenId[requestId] = tokenId;
    emit RequestedDerpieMint(requestId, tokenId);
  }

  // receives randomness from Chainlink VRF
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    address randomNumberRequester = randomNumberRequestIdToSender[requestId];
    uint256 tokenId = randomNumberRequestIdToTokenId[requestId];
    _safeMint(randomNumberRequester, tokenId);
    emit MintedDerpie(randomNumberRequester, tokenId);
    uint256 randomNumber = randomness % 20;
    tokenIdToRandomizedDerpieId[tokenId] = randomNumber;
  }

  function setBaseURI(string memory _newBaseTokenURI) public onlyOwner {
    baseTokenURI = _newBaseTokenURI;
  }

  receive() external payable {
    emit ReceiveFunctionExecuted(msg.sender, msg.value);
  }

  fallback() external payable {
    emit FallbackFunctionExecuted(msg.sender, msg.value);
  }

  // OVERRIDES
  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    uint256 derpieId = tokenIdToRandomizedDerpieId[tokenId];

    string memory derpie = randomizedDerpieIdToDerpieName[derpieId];
    string memory baseURI = _baseURI();
    string memory json = ".json";
    return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, derpie, json)) : "";
  }
}
