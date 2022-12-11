pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract SigTest {
    using ECDSA for bytes32;

    address private systemAddress;

    constructor(address _systemAddress) {
        systemAddress = 0xa8d05d93b217A241e95B15E0B9419A0CB70B85E6;
    }

    function isValidSignature(bytes32 hash, bytes memory signature) internal view returns (bool isValid) {
        bytes32 signedHash = keccak256(abi.encodePacked('\x19Ethereum Signed Message:\n32', hash));
        console.log('Recovered address is: ', signedHash.recover(signature));
        return signedHash.recover(signature) == systemAddress;
    }

    function isDataValid(address personAddress, uint16 year, bytes memory signature) public {
        // Build the hash and check the sig
        // We only accept sigs from the system
        bytes32 msgHash = keccak256(abi.encodePacked(personAddress, year));
        require(isValidSignature(msgHash, signature), 'Invalid signature');
    }

    function compareHash(bytes32 _hash, string memory message) public {
        bytes32 hash1 = keccak256(abi.encodePacked(message));
        bytes32 hash2 = keccak256(abi.encodePacked(hash1));
        require(hash2 == _hash, "Hash doesn't match");
    }

    function VerifyOldEnough(bytes32 startingHash, bytes32 finalHash, uint issuedYear, uint yearsToProve, bytes memory signature) public {
        bytes32 hash = keccak256(abi.encodePacked(startingHash));
        for (uint i = 0; i < yearsToProve - 1; i++) {
            hash = keccak256(abi.encodePacked(hash));
        }
        require(hash == finalHash, 'ZK proof for age failed');
    }

    function VerifyOldEnoughAndKYC(bytes32 startingHash, bytes32 finalHash, uint16 issuedYear, uint yearsToProve, bytes memory signature) public {
        //Check data signature -> this also proves KYC
        bytes32 msgHash = keccak256(abi.encodePacked(msg.sender, finalHash, issuedYear));
        require(isValidSignature(msgHash, signature), 'Invalid signature');
        //Check ZK proof
        VerifyOldEnough(startingHash, finalHash, issuedYear, yearsToProve, signature);
    }
}
