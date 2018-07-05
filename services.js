var app = angular.module('app');

app.service('web3', function() {
    
            if (typeof web3 !== 'undefined') {
                var web3 = new Web3(web3.currentProvider);
            } else {
                var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
                //var web3 = new Web3(new Web3.providers.HttpProvider("http://blockchain.vitalzero.com.br"));
                web3._extend({
                    property: 'miner',
                    methods:
                    [
                        new web3._extend.Method({
                            name: 'start',
                            call: 'miner_start',
                            params: 1,
                            inputFormatter: [web3._extend.formatters.formatInputInt],
                            outputFormatter: web3._extend.formatters.formatOutputBool
                        }),
                        new web3._extend.Method({
                            name: 'stop',
                            call: 'miner_stop',
                            params: 1,
                            inputFormatter: [web3._extend.formatters.formatInputInt],
                            outputFormatter: web3._extend.formatters.formatOutputBool
                        }),
                        new web3._extend.Method({
                            name: 'setExtra',
                            call: 'miner_setExtra',
                            params: 1,
                            inputFormatter: [web3._extend.utils.formatInputString],
                            outputFormatter: web3._extend.formatters.formatOutputBool
                        }),
                        new web3._extend.Method({
                            name: 'setGasPrice',
                            call: 'miner_setGasPrice',
                            params: 1,
                            inputFormatter: [web3._extend.utils.formatInputString],
                            outputFormatter: web3._extend.formatters.formatOutputBool
                        }),
                        new web3._extend.Method({
                            name: 'startAutoDAG',
                            call: 'miner_startAutoDAG',
                            params: 0,
                            inputFormatter: [],
                            outputFormatter: web3._extend.formatters.formatOutputBool
                        }),
                        new web3._extend.Method({
                            name: 'stopAutoDAG',
                            call: 'miner_stopAutoDAG',
                            params: 0,
                            inputFormatter: [],
                            outputFormatter: web3._extend.formatters.formatOutputBool
                        }),
                        new web3._extend.Method({
                            name: 'makeDAG',
                            call: 'miner_makeDAG',
                            params: 1,
                            inputFormatter: [web3._extend.formatters.inputDefaultBlockNumberFormatter],
                            outputFormatter: web3._extend.formatters.formatOutputBool
                        })
                    ],
                    properties:
                    [
                        new web3._extend.Property({
                            name: 'hashrate',
                            getter: 'miner_hashrate',
                            outputFormatter: web3._extend.utils.toDecimal
                        })
                    ]
                });
                return web3;
            }
    
        });