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

    app.controller('indexController', function($scope, web3) {

        $scope.getBalance = function(){
            $scope.wallets = web3.eth.accounts;

            console.info($scope.wallets);

            angular.forEach($scope.wallets, function(w){
                $scope.balance = web3.fromWei( web3.eth.getBalance(w), 'ether' );
                console.info($scope.balance);
            });

            

        }

        //coinbase
        $scope.coinbase =  {
            address: web3.eth.coinbase
        };

        $scope.coinbase.balance = web3.fromWei( web3.eth.getBalance($scope.coinbase.address), 'ether' );

    });



}).call(this);