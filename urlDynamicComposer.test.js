const chai = require('chai'); //more advanced assert module
const expect = chai.expect; //assign the expect flavor of chai to our constants. Can also be should or assert

chai.use(require('chai-string')); //has methods like startsWith

const urlDynamicComposer = require('./urlDynamicComposer');
var goodUrl="";

describe('urlPassVerification: validate provided url', () => {
    context('check if provided url has no tokens',()=>{        
        it('test with 0 token',()=>{
            goodUrl="https://test.com/ab08:12/module/file.pdf";
            expect(urlDynamicComposer.urlPassVerification(goodUrl).result).equal(false);
            expect(urlDynamicComposer.urlPassVerification(goodUrl).msg).equal("no tokens found in this url");
        })
    });
    context('check for uneven nbr of @ chars',()=>{
        it('test with 1 @ char',()=>{
            goodUrl="https://test.com/ab08@12/module/file.pdf";
            expect(urlDynamicComposer.urlPassVerification(goodUrl).result).equal(false);
            expect(urlDynamicComposer.urlPassVerification(goodUrl).msg).equal("invalid token composition: 1 @ characters found");
        });
        it('test with 3 @ char',()=>{
            goodUrl="https://test.com/ab08@1@2@/module/file.pdf";
            expect(urlDynamicComposer.urlPassVerification(goodUrl).result).equal(false);
            expect(urlDynamicComposer.urlPassVerification(goodUrl).msg).equal("invalid token composition: 3 @ characters found");
        });
    });
    context('check for valid tokenization syntax',()=>{        
        it('positive test with 1 token',()=>{
            goodUrl="https://test.com/ab@08:12@/module/file.pdf";
            expect(urlDynamicComposer.urlPassVerification(goodUrl).result).equal(true);
            expect(urlDynamicComposer.urlPassVerification(goodUrl).msg).equal("valid token setup found: nbr tokens identified: 1");
        });
        
        it('positive test with 2 tokens',()=>{
            goodUrl="https://test.com/ab@08:12@/module/ab@08:12@file.pdf";
            expect(urlDynamicComposer.urlPassVerification(goodUrl).result).equal(true);
            expect(urlDynamicComposer.urlPassVerification(goodUrl).msg).equal("valid token setup found: nbr tokens identified: 2");
        });

        it('negative test with 3 @ chars',()=>{
            badUrl="https://test.com/ab@08:12/module/ab@08:12@file.pdf";
            expect(urlDynamicComposer.urlPassVerification(badUrl).result).equal(false);
            expect(urlDynamicComposer.urlPassVerification(badUrl).msg).equal("invalid token composition: 3 @ characters found");
        });

        it('negative test with 1 @ chars',()=>{
            badUrl="https://test.com/ab@08:12/module/file.pdf";
            expect(urlDynamicComposer.urlPassVerification(badUrl).result).equal(false);
            expect(urlDynamicComposer.urlPassVerification(badUrl).msg).equal("invalid token composition: 1 @ characters found");
        });
    })
});

describe('identifyTokens: identify list of tokens', () => {
    context('check the nbr of valid tokens in provided url',()=>{        
        it('test with 1 token',()=>{
            testUrl="https://test.com/ab@08:12@/module/file.pdf";
            expect(urlDynamicComposer.identifyTokensInUrl(testUrl).nbrOfTokens).equal(1);
            expect(urlDynamicComposer.identifyTokensInUrl(testUrl).validStatus).equal(true);
        });
        it('test with 2 tokens',()=>{
            testUrl="https://test.com/ab@08:12@/module/ab@08:12@file.pdf";
            expect(urlDynamicComposer.identifyTokensInUrl(testUrl).nbrOfTokens).equal(2);
        });
        it('test with invalid tokens',()=>{
            testUrl="https://test.com/ab@08:12/module/ab@08:12@file.pdf";
            expect(urlDynamicComposer.identifyTokensInUrl(testUrl).validStatus).equal(false);
        });
    });
});
