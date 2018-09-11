pragma solidity ^0.4.24;

contract FileFactory {
    address[] public deployedFiles;
    
    mapping(address => address[]) public files;
    
    function createFile(bytes32 _digest, uint8 _hashFunction, uint8 _size) public {
        address newFile = new File(_digest, _hashFunction, _size, msg.sender);
        deployedFiles.push(newFile);
        files[msg.sender].push(newFile);
    }
    
    function getDeployedFiles() public view returns (address[]) {
        return deployedFiles;
    }
    
    function getMyFiles(address sender) public view returns(address[]) {
        return files[sender];
    }
}

contract File {
    address public manager;
    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
  }
  
  Multihash ipfsHash;
    
    mapping(address => bool) shared;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(bytes32 _digest, uint8 _hashFunction, uint8 _size, address creator) public {
        ipfsHash = Multihash(_digest, _hashFunction, _size);
        manager = creator;
    }
    
    function shareFile(address recipient) public restricted {
        shared[recipient] = true;
    }
    
    function getSharedFile() public view returns (bytes32 _digest, uint8 _hashFunction, uint8 _size){
        require(shared[msg.sender]);
        return (ipfsHash.digest, ipfsHash.hashFunction, ipfsHash.size);
    }
    
    function getFile() public view restricted returns (bytes32 _digest, uint8 _hashFunction, uint8 _size){
        return (ipfsHash.digest, ipfsHash.hashFunction, ipfsHash.size);
    }
}