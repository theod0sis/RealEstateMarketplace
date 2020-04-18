var Verifier = artifacts.require('Verifier.sol');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier.sol');

contract('TestSolnSquareVerifier', accounts => {

    const correctProof ={
        "proof": {
            "a": ["0x1ba0df5159c4c75da8a30d34e28b0a2242b9634aed77c9b41b979e6081ed5033", "0x04a81e18c8c57362b000213bce6d533055ba4f830dc76abf9c5bf37907ffbdd0"],
            "b": [["0x272c1132c59a11b904df2e3921eaf7b40ce948a1a24e9b36dd6e2e04cc3e9560", "0x1535e1e6c5cb4d685ef68595487910d68d8813765f422b977b53e32f8c53fc94"], ["0x26e8a26d9bd754c038c42bb9b5b32b91a0c1463aba53b03eb8e224f1230f853a", "0x2c080f65faca972f26229da56b338fc12d62261f8626ec42659bc1090e7a983d"]],
            "c": ["0x08c833d09a989255fa84bd16e9b4374fbf2c59f92f8b67298771b72c03e56f7f", "0x2f85944aef8c9f217463077e0d8f85fdf5546b3b570820ade0cf9c95a3feb440"]
        },
        "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000001"]
    }
    const account_one = accounts[0];

    describe('verify proof', function () {

        beforeEach(async function () {
            let verifierContract = await Verifier.new({from: account_one});
            this.contract = await SolnSquareVerifier.new(verifierContract.address, {from: account_one});
        })

        it('Test if a new solution can be added for contract', async function () {
            var eventEmitted = false
            await this.contract.SolutionAdded((err,resp) => {
                eventEmitted = true
            });
            await this.contract.mintToken(accounts[0],2,correctProof.proof.a,correctProof.proof.b,correctProof.proof.c,correctProof.inputs,{from: accounts[0]});
            assert.equal(eventEmitted,true,"Event SolutionAdded didnt emit");
        })

        it('Test if an ERC721 token can be minted for contract', async function () {
            let v = await this.contract.mintToken(accounts[0],1,correctProof.proof.a,correctProof.proof.b,correctProof.proof.c,correctProof.inputs,{from: accounts[0]});
            assert.equal(v.logs[1].type, 'mined',"Token didnt mint");
        })

    })
})