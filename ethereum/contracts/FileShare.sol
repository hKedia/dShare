pragma solidity ^0.4.24;

contract FileFactory {
    address[] public deployedFiles;
    
    function createFile(string ipfsHash) public {
        address newFile = new File(ipfsHash, msg.sender);
        deployedFiles.push(newFile);
    }
    
    function getDeployedFiles() public view returns (address[]) {
        return deployedFiles;
    }
}

contract File {
    address public manager;
    string fileIpfsHash;
    
    mapping(address => bool) shared;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(string ipfsHash, address creator) public {
        fileIpfsHash = ipfsHash;
        manager = creator;
    }
    
    function shareFile(address recipient) public restricted {
        shared[recipient] = true;
    }
    
    function getFile() public view returns (string){
        require(shared[msg.sender]);
        return fileIpfsHash;
    }
}