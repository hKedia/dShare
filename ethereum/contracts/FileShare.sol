pragma solidity ^0.4.25;

/// @title FileFactory
/// @notice Facilitates the creation and deployment of files
/// @dev Factory contract to deploy individual files uploaded by users
contract FileFactory {
    /// @notice Stores the list of files deployed by an address
    mapping(address => address[]) uploadedFiles;

    /// @notice Stores the list of files shared by an address
    mapping(address => address[]) sharedFiles;

    /// @notice Stores the list of files shared with an address
    mapping(address => address[]) recipientFiles;

    /// @notice Stores the list of files archived by all users
    address[] archivedFiles;

    /// @notice List of Uploaders
    mapping(address => bool) uploaders;

    /// @notice List of Recipients
    mapping(address => bool) recipients;


    /// @dev To restrict execution of certain functions to the uploaders
    modifier isUploader(address _from) {
        require(uploaders[_from], "Sender is not the uploader");
        _;
    }

    /// @notice Deploys a file contract to the blockchain
    /// @dev Deploys a new contract which stores file details
    /// @param _digest Hash function digest
    /// @param _hashFunction Hash function code
    /// @param _size Size of _digest in bytes
    /// @param _fileHash sha3 hash of the uploaded file
    function createFile(bytes32 _digest, uint8 _hashFunction, uint8 _size, bytes32 _fileHash) public {
        address newFile = new File(_digest, _hashFunction, _size, _fileHash, this, msg.sender);
        uploadedFiles[msg.sender].push(newFile);
        uploaders[msg.sender] = true;
    }

    /// @notice Retrives the list of deployed files
    /// @dev Retrives the list of files from mapping uploadedFiles based on msg.sender
    /// @return An address array with deployed files
    function getUploadedFiles() public view returns(address[]) {
        return uploadedFiles[msg.sender];
    }

    /// @notice Shares a deployed file with a recipient
    /// @dev Updates the sharedFiles, recipientFiles and recipients with passed data
    /// @param _recipient The address of recipient the file is to be shared with
    /// @param _file The address of the deployed file
    /// @param _from The address of the uploader
    function shareFile(address _recipient, address _file, address _from) public isUploader(_from){
        sharedFiles[_from].push(_file);
        recipientFiles[_recipient].push(_file);
        recipients[_recipient] = true;
    }

    /// @notice Retrives the list of files shared with a particular recipient
    /// @dev Retrives the array from mapping recipientFiles based on msg.sender
    /// @return An address array with files shared with the user.
    function getRecipientFiles() public view returns(address[]) {
        return recipientFiles[msg.sender];
    }

    /// @notice Retrives the list of files shared by a particular user
    /// @dev Retrives the array from mapping sharedFiles based on msg.sender
    /// @return An address array with shared files
    function getSharedFiles() public view returns(address[]) {
        return sharedFiles[msg.sender];
    }

    /// @notice Stores the file's address archived by any user
    /// @dev Adds the archieved file address to archivedFiles array
    /// @param _file The address of the deployed file to be archived
    /// @param _from the address of the uploader
    function archiveFile(address _file, address _from) public isUploader(_from){
        archivedFiles.push(_file);
    }

    /// @notice Retrives the list of archived files
    /// @dev Retrives the array archivedFiles
    /// @return The array archivedFiles
    function getArchivedFiles() public view returns(address[]) {
        return archivedFiles;
    }

    /// @notice Restores the previously archived file
    /// @dev Deletes the specified entry from archiveFile array
    /// @param _index The index of the file in archiveFile array
    /// @param _from The address of the uploader
    function restoreFile(uint _index, address _from) public isUploader(_from) {
        removeByIndex(_index, archivedFiles);
    }

    /// @notice Unshare a previously shared file with a specific user
    /// @dev Removes the file's address from sharedFiles and recipientFiles
    /// @param _indexOwner The index of file in sharedFiles
    /// @param _indexRecipient The index of file in recipientFiles
    /// @param _recipient The address of recipient
    /// @param _from the Address of uploader
    function stopSharing(uint _indexOwner, uint _indexRecipient, address _recipient, address _from) public isUploader(_from) {
        removeByIndex(_indexOwner, sharedFiles[_from]);
        removeByIndex(_indexRecipient, recipientFiles[_recipient]);
    }

    /// @dev Function to delete element from an array
    /// @param _index The index of element to be removed
    /// @param _array The array containing the element
    function removeByIndex(uint _index, address[] storage _array) internal {
        _array[_index] = _array[_array.length - 1];
        delete _array[_array.length - 1];
        _array.length--;
    }
}

/// @title File
/// @notice Stores the details of a deployed file
/// @dev The file contract deployed by factory for each uploaded file
contract File {
    /// @notice The address of the uploader
    address public manager;

    /// @notice sha3 hash of the file
    bytes32 sha3hash;

    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
    }

    /// @notice The address of the factory contract
    FileFactory ff;

    /// @notice The IPFS hash of the file
    Multihash fileIpfsHash;

    /// @notice List of recipients the file is shared with
    address[] recipientsList;

    /// @notice Stores the encrypted key's IPFS hash for each recipient
    mapping(address => Multihash) keyLocation;

    /// @dev To restrict execution of certain function to the owner of the file
    modifier isOwner() {
        require(msg.sender == manager, "Sender is not the owner");
        _;
    }

    /// @notice Initializes the variables with values passed by the factory upon file creation
    /// @dev The constructor calles upon file deployment
    /// @param _digest Hash function digest
    /// @param _hashFunction Hash function code
    /// @param _size size of _digest in bytes
    /// @param _fileHash sha3 hash of the file
    /// @param _factory The address of the factory contract
    /// @param _creator The address of the uploader
    constructor(bytes32 _digest, uint8 _hashFunction, uint8 _size, bytes32 _fileHash, address _factory, address _creator) public {
        fileIpfsHash = Multihash(_digest, _hashFunction, _size);
        manager = _creator;
        sha3hash = _fileHash;
        ff = FileFactory(_factory);
    }

    /// @notice Returns the file's IPFS hash
    /// @dev Returns the IPFS hash of the uploaded file in multihash format
    /// @return The IPFS hash's digest, hashFunction and size
    function getFileDetail() public view returns (bytes32, uint8, uint8){
        return (fileIpfsHash.digest, fileIpfsHash.hashFunction, fileIpfsHash.size);
    }

    /// @notice Returns the file's sha3 hash
    /// @dev Returns the file's sha3 hash
    /// @return The sha3 hash of the uploaded file
    function getFileSha3Hash() public view returns (bytes32) {
        return sha3hash;
    }

    /// @notice Function to share an uploaded file
    /// @dev Updates the recipientsList and keyLocation and calls the factory' shareFile()
    /// @param _recipient The address of the recipient
    /// @param _digest Hash function digest of the key
    /// @param _hashFunction Hash function code
    /// @param _size size of _digest in bytes
    function shareFile(address _recipient, bytes32 _digest, uint8 _hashFunction, uint8 _size) public isOwner {
        recipientsList.push(_recipient);
        keyLocation[_recipient] = Multihash(_digest, _hashFunction, _size);
        ff.shareFile(_recipient, this, msg.sender);
    }

    /// @notice Retrives the details of a shared file
    /// @dev Returns the file and it's key specific to the recipient
    /// @return The file IPFS hash and it's key IPFS hash
    function getSharedFileDetail() public view returns (bytes32 , uint8 , uint8 , bytes32 , uint8 , uint8 ){
        return (fileIpfsHash.digest, fileIpfsHash.hashFunction, fileIpfsHash.size, keyLocation[msg.sender].digest, keyLocation[msg.sender].hashFunction, keyLocation[msg.sender].size);
    }

    /// @notice Function to archive the file
    /// @dev Calls the factory's archiveFile()
    function archiveFile() public isOwner {
        ff.archiveFile(this, msg.sender);
    }

    /// @notice Function to restore the file
    /// @dev Calls the factory's restoreFile()
    /// @param _index The index of the file in the archiveFiles array
    function restoreFile(uint _index) public isOwner {
        ff.restoreFile(_index, msg.sender);
    }

    /// @notice Retrives the list of recipient for a given file
    /// @dev Returns the list of recipients
    /// @return The recipientsList array
    function getRecipientsList() public view returns(address[]) {
        return recipientsList;
    }

    /// @notice Function to stop sharing a file
    /// @dev Deletes the data from keyLocation and recipientsList and calls the factory's stopSharing()
    /// @param _indexFactoryOwner The file's index in sharedFiles array for the respective uploader
    /// @param _indexFactoryRecipient The file's index in recipientFiles array for the respective recipient
    /// @param _indexFileRecipient The recipient's index in recipientsList array
    /// @param _recipient The array of the recipient
    function stopSharing(uint _indexFactoryOwner, uint _indexFactoryRecipient, uint _indexFileRecipient, address _recipient) public isOwner {
        delete keyLocation[_recipient];
        recipientsList[_indexFileRecipient] = recipientsList[recipientsList.length - 1];
        delete recipientsList[recipientsList.length - 1];
        recipientsList.length--;
        ff.stopSharing(_indexFactoryOwner, _indexFactoryRecipient, _recipient, msg.sender);
    }
}
