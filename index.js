(function(){

    var app = angular.module('app', []);

    app.run(function() {

    });

    app.controller('indexController', function($scope, web3, MyContractPayable, api) {

        $scope.wallets = [];

        $scope.getBalance = function(){
            $scope.wallets = [];

            var _wallets = web3.eth.accounts;

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
        $scope.increaseCounter = function() {
            //constant function: apenas chamar
            var counter = $scope.contract.getCounter().toNumber();
            counter++;

            //desbloqueia a conta
            web3.personal.unlockAccount(web3.eth.coinbase, 'hmhallan');

            //parametro da funcao, metadados, callback
            var meta = {
                from : web3.eth.coinbase,
                gas: 200000
            }
            $scope.contract.setCounter(counter, meta, function(error, txHash){
                if (error){
                    console.error(error);
                }
                else{
                    //$scope.txHash = txHash;
                    $scope.callWhenMined( txHash, $scope.getCounter );
                }
            });
        }

        $scope.callWhenMined = function( txHash, callback ){
            web3.eth.getTransactionReceipt( txHash, function(error, receipt){
                if (error){
                    console.error(error);
                }
                else{
                    if (!receipt){
                        setTimeout( $scope.callWhenMined( txHash, callback ), 1000 );
                    }
                    else{
                        callback();
                    }
                }

            });
        }

        api.contract.exemplo1().then(function(result){
            console.info(result.data);
            $scope.deployContract(result.data);
        });



        /*
        * Minerador remoto
        */

        $scope.mining_threads = 1

        $scope.checkPendingTransactions = function() {
            if (web3.eth.getBlock("pending").transactions.length > 0) {
                if (web3.eth.mining) {
                    console.log("== Pending transactions! Mining continues...");
                    return;
                }
                console.log("== Pending transactions! Mining...");
                web3.miner.start($scope.mining_threads);
                setTimeout( $scope.checkPendingTransactions, 5000 );
            } else {
                web3.miner.stop(0);  // This param means nothing
                console.log("== No transactions! Mining stopped.");
            }
        }

        $scope.startMiner = function() {
                if (web3.eth.mining) return;
                console.log("Mining...");
                web3.miner.start($scope.mining_threads);
                setTimeout( $scope.checkPendingTransactions, 5000 );
        }

        $scope.stopMiner = function() {
            web3.miner.stop(0);
        }

        /** contratos */
        $scope.deployContract = function(contract_code) {
            var compiled_contract = web3.eth.compile.solidity(contract_code);
            var code = compiled_contract['<stdin>:MyContract'].code;
            var abi = compiled_contract['<stdin>:MyContract'].info.abiDefinition;

            console.log(compiled_contract);

            web3.personal.unlockAccount(web3.eth.coinbase, 'hmhallan');
            
            //deploy do contrato
            web3.eth.contract(abi).new({
                data: code,
                from: web3.eth.coinbase,
                gas: 3000000
            }, function (error, result) {
                if (error) {
                    console.error(error);
                } else {
                    if (result.address) {
                        contract_instance = result;
                        console.log(contract_instance);
                        
                        $scope.contratoImplantado = true;
                    }
                }
            });
        }

    });


    app.factory('api', function($http){

        return {
            contract: {
                exemplo1: function(){
                    return $http.get('MyContractPayable.sol');
                }
            }

        }

    });

    /*
    app.constant( 'MyContractPayable', {
        address: "0xA49458DAA080eEB2A1C20Ff26d1D07d3B3dFcD90",
        abi: [ { "constant": true, "inputs": [], "name": "getBalance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwner", "outputs": [ { "name": "", "type": "address", "value": "0xb4e68837693fe4294d1766260d3266d36dec0b40" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCounter", "outputs": [ { "name": "", "type": "uint256", "value": "5" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_counter", "type": "uint256" } ], "name": "setCounter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" } ]
    });
    */
    app.constant( 'MyContractPayable', {
        address: "0x9892828847b52788d46992466Ae826B623f0961F",
        abi: [ { "constant": true, "inputs": [], "name": "getBalance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getOwner", "outputs": [ { "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCounter", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_counter", "type": "uint256" } ], "name": "setCounter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "constructor", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" } ]
    });

}).call(this);