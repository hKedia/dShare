pragma solidity ^0.4.25;

contract FileFactory {
    mapping(address => address[]) uploadedFiles;
    mapping(address => address[]) sharedFiles;
    mapping(address => address[]) recipientFiles;
    
    address[] archivedFiles;
    
    mapping(address => bool) uploaders;
    mapping(address => bool) recipients;
    
    modifier isUploader(address _from) {
        require(uploaders[_from]);
        _;
    }
    
    modifier isRecipient(address _from) {
        require(recipients[_from]);
        _;
    }
    
    function createFile(bytes32 _digest, uint8 _hashFunction, uint8 _size, bytes32 _fileHash) public {
        address newFile = new File(_digest, _hashFunction, _size, _fileHash, this, msg.sender);
        uploadedFiles[msg.sender].push(newFile);
        uploaders[msg.sender] = true;
    }
    
    function getUploadedFiles() public view returns(address[]) {
        return uploadedFiles[msg.sender];
    }
    
    function shareFile(address _recipient, address _file, address _from) public isUploader(_from){
        sharedFiles[_from].push(_file);
        recipientFiles[_recipient].push(_file);
        recipients[_recipient] = true;
    }
    
    function getRecipientFiles() public view returns(address[]) {
        return recipientFiles[msg.sender];
    }
    
    function getSharedFiles() public view returns(address[]) {
        return sharedFiles[msg.sender];
    }
    
    function archiveFile(address _file, address _from) public isUploader(_from){
        archivedFiles.push(_file);
    }
    
    function getArchivedFiles() public view returns(address[]) {
        return archivedFiles;
    }
    
    function restoreFile(uint _index, address _from) public isUploader(_from) {
        removeByIndex(_index, archivedFiles);
    }
    
    function stopSharing(uint _indexOwner, uint _indexRecipient, address _recipient, address _from) public isUploader(_from) {
        removeByIndex(_indexOwner, sharedFiles[_from]);
        removeByIndex(_indexRecipient, recipientFiles[_recipient]);
    }
    
    function removeByIndex(uint _index, address[] storage _array) internal {
        address lastElement = _array[_array.length - 1];
        _array[_index] = lastElement;
        _array.length--;
    }
}

contract File {
    address public manager;
    
    bytes32 sha3hash;
    
    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
    }
  
    FileFactory ff;
  
    Multihash fileIpfsHash;
    
    address[] recipientsList;
    
    mapping(address => Multihash) keyLocation;
    
    modifier isOwner() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(bytes32 _digest, uint8 _hashFunction, uint8 _size, bytes32 _fileHash, address _factory, address _creator) public {
        fileIpfsHash = Multihash(_digest, _hashFunction, _size);
        manager = _creator;
        sha3hash = _fileHash;
        ff = FileFactory(_factory);
    }
    
    function getFileDetail() public view returns (bytes32, uint8, uint8){
        return (fileIpfsHash.digest, fileIpfsHash.hashFunction, fileIpfsHash.size);
    }
    
    function getFileSha3Hash() public view returns (bytes32) {
        return sha3hash;
    }
    
    function shareFile(address _recipient, bytes32 _digest, uint8 _hashFunction, uint8 _size) public isOwner {
        recipientsList.push(_recipient);
        keyLocation[_recipient] = Multihash(_digest, _hashFunction, _size);
        ff.shareFile(_recipient, this, msg.sender);
    }
    
    function getSharedFileDetail() public view returns (bytes32 , uint8 , uint8 , bytes32 , uint8 , uint8 ){
        return (fileIpfsHash.digest, fileIpfsHash.hashFunction, fileIpfsHash.size, keyLocation[msg.sender].digest, keyLocation[msg.sender].hashFunction, keyLocation[msg.sender].size);
    }
    
    function archiveFile() public isOwner {
        ff.archiveFile(this, msg.sender);
    }
    
    function restoreFile(uint _index) public isOwner {
        ff.restoreFile(_index, msg.sender);
    }
    
    function getRecipientsList() public view returns(address[]) {
        return recipientsList;
    }
    
    function stopSharing(uint _indexFactoryOwner, uint _indexFactoryRecipient, uint _indexFileRecipient, address _recipient) public isOwner {
        delete keyLocation[_recipient];
        address last = recipientsList[recipientsList.length - 1];
        recipientsList[_indexFileRecipient] = last;
        recipientsList.length--;
        ff.stopSharing(_indexFactoryOwner, _indexFactoryRecipient, _recipient, msg.sender);
    }
}