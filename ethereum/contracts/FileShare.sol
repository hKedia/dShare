pragma solidity ^0.4.25;

contract FileFactory {
    mapping(address => address[]) public deployedFiles;
    mapping(address => address[]) public sharedFiles;
    
    function createFile(bytes32 _digest, uint8 _hashFunction, uint8 _size) public {
        address newFile = new File(_digest, _hashFunction, _size, msg.sender, this);
        deployedFiles[msg.sender].push(newFile);
    }
    
    function getMyFiles() public view returns(address[]) {
        return deployedFiles[msg.sender];
    }
    
    function updateSharedFiles(address recipient, address file) public {
        sharedFiles[recipient].push(file);
    }
    
    function getSharedFiles() public view returns(address[]) {
        return sharedFiles[msg.sender];
    }
}

contract File {
    address public manager;
    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
  }
  
  FileFactory ff;
  
  Multihash ipfsHash;
    
    mapping(address => bool) shared;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(bytes32 _digest, uint8 _hashFunction, uint8 _size, address creator, address factory) public {
        ipfsHash = Multihash(_digest, _hashFunction, _size);
        manager = creator;
        ff = FileFactory(factory);
    }
    
    function shareFile(address recipient) public restricted {
        shared[recipient] = true;
        ff.updateSharedFiles(recipient, this);
    }
    
    function getSharedFileDetail() public view returns (bytes32 _digest, uint8 _hashFunction, uint8 _size){
        require(shared[msg.sender]);
        return (ipfsHash.digest, ipfsHash.hashFunction, ipfsHash.size);
    }
    
    function getFileDetail() public view restricted returns (bytes32 _digest, uint8 _hashFunction, uint8 _size){
        return (ipfsHash.digest, ipfsHash.hashFunction, ipfsHash.size);
    }
}