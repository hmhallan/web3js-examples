pragma solidity ^0.4.16;

contract MyContractPayable {
    
    uint256 counter;
    address owner;


    constructor() public payable {
        counter = 5;
        owner = msg.sender;
    }
    
    function setCounter( uint256 _counter ) public {
        counter = _counter;
    }
    function getCounter() public constant returns (uint256) {
        return counter;
    } 
    
    function getBalance() public constant returns (uint256){
        return address(this).balance;
    }

    function getOwner() public constant returns (address){
        return owner;
    }
    

    function () public payable {
        
    }

}