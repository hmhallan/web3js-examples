pragma solidity ^0.4.18;

contract MyContractPayable {
    
    uint256 counter;
    address owner;

    event changedCounter(address who, uint256 old, uint256 new);

    constructor() public payable {
        counter = 5;
        owner = msg.sender;
    }
    
    function setCounter( uint256 _counter ) public {
        changedCounter(msg.sender, counter, _counter);
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