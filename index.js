(function(){

    var app = angular.module('app', []);

    app.run(function() {

    });


    app.service('web3', function() {
        if (typeof web3 !== 'undefined') {
            return new Web3(web3.currentProvider);
        } else {
            return new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }

    });

    app.controller('indexController', function($scope, web3, MyContractPayable) {

        $scope.wallets = [];

        $scope.getBalance = function(){
            var _wallets = web3.eth.accounts;

            console.info($scope._wallets);

            angular.forEach(_wallets, function(w){
                var _balance = web3.fromWei( web3.eth.getBalance(w), 'ether' );
                
                $scope.wallets.push( { address: w, balance: _balance } );
            });

            

        }

        //coinbase
        $scope.coinbase =  {
            address: web3.eth.coinbase
        };

        $scope.coinbase.balance = web3.fromWei( web3.eth.getBalance($scope.coinbase.address), 'ether' );

        //instancia do contrato
        $scope.contract = web3.eth.contract( MyContractPayable.abi ).at( MyContractPayable.address );

        $scope.getCounter = function() {
            //constant function: apenas chamar
            $scope.counter = $scope.contract.getCounter().toNumber();
        }
    });

    app.constant( 'MyContractPayable', {
        address: "0xA49458DAA080eEB2A1C20Ff26d1D07d3B3dFcD90",
        abi: [ { "constant": true, "inputs": [], "name": "getBalance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwner", "outputs": [ { "name": "", "type": "address", "value": "0xb4e68837693fe4294d1766260d3266d36dec0b40" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCounter", "outputs": [ { "name": "", "type": "uint256", "value": "5" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_counter", "type": "uint256" } ], "name": "setCounter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" } ]
    });
    

}).call(this);