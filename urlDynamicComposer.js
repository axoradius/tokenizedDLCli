var printLL = require('printlogline');
var fullUrls = [];

function urlPassVerification(myUrl) {
    var tokenizedUrl = myUrl;
    var nbrAtChars = tokenizedUrl.split("@").length-1;
    var nbrTokens = nbrAtChars / 2;
    var nbrIssues = 0;
    const maxNbrTokens=2; //only support currently for 2 tokens in a provided url


    if (nbrTokens == 0) {
        nbrIssues++;
        errorMsg = "no tokens found in this url"
    };
    if (nbrTokens != 0 && nbrTokens != 1 && nbrTokens != 2 ) {
        nbrIssues++;
        errorMsg = "invalid token composition: " + nbrAtChars + " @ characters found";
    }


    if (nbrIssues == 0 ) {
        return {
            result : true,
            msg : "valid token setup found: nbr tokens identified: " + nbrTokens
        }
    } else {
        return {
            result : false,
            msg : errorMsg
        }
    }

}

function identifyTokens(url) {
    var tokenizedUrl = url;
    var tokenArray = [];
    var cntIdentify=true;
    var pos1,pos2,nbrOfTokens = 0;
    var restString="";

    var passedValidation = urlPassVerification(tokenizedUrl);
    if (passedValidation.result) {
        do {
            pos1=tokenizedUrl.indexOf('@'); //find the position of the first @ symbol
            restString=tokenizedUrl.slice(pos1+1); //extract rest of the string after the @
            pos2=pos1+restString.indexOf('@')+1; //position of the second @ in the original url
            if (pos2>pos1) { //in case 2 @ at different position are found, otherwise exit while loop
                var token=tokenizedUrl.slice(pos1+1,pos2)//get token value between the 2 @
                tokenArray.push(token)
                //printLL("",`between ${pos1} and ${pos2} contains ${token} remainder ${tokenizedUrl.substring(pos2+1)}`);
                
                replacedToken = "XX" + nbrOfTokens + "XX"
                var tokenizedUrl = tokenizedUrl.substring(0,pos1) + replacedToken + tokenizedUrl.substring(pos2+1);
                //printLL("??", tokenizedUrl);
                nbrOfTokens++
                //console.log("--")
            } else {

                cntIdentify=false;
            }
        }
        //while (myUrl.includes('@')); 
        while (cntIdentify);

        //printLL("=> ", tokenizedUrl);

        return {
            nbrOfTokens,
            tokenizedUrl,
            tokenArray,
            validStatus: passedValidation.result,
            msg: "valid tokenized url"
        };
    } else {
        return {
            nbrOfTokens: 0,
            tokenizedUrl: "",
            tokenArray: [],
            validStatus: passedValidation.result,
            msg: passedValidation.msg
        }
    };
}

function replaceTokenUrl(srcUrl,searchValue,startNbr,endNbr,nbrLeadingZeros=0) {
    //create all numbers between startNbr and endNbr
    currentNbr = parseInt(startNbr); //set the start for loop with currentNbr to the startNbr1
    //console.log("start loop2: ",currentNbr," endNumber ", endNbr," url1 ", srcUrl, " searchValue ", searchValue);
    while (currentNbr <= endNbr) {  
        replaceValue=currentNbr.toString();
        if ( nbrLeadingZeros == "0" ) {newUrl = srcUrl.replace(searchValue,replaceValue)};
        if ( nbrLeadingZeros == "1" && currentNbr < 10 ) {newUrl = srcUrl.replace(searchValue,"0"+replaceValue)};
        if ( nbrLeadingZeros == "1" && currentNbr >= 10 && endNbr < 100 ) {newUrl = srcUrl.replace(searchValue,replaceValue)};
        if ( nbrLeadingZeros == "1" && currentNbr >= 10 && currentNbr < 100 && endNbr >= 100 ) {newUrl = srcUrl.replace(searchValue,"0"+replaceValue)};
        if ( nbrLeadingZeros == "1" && currentNbr >= 10 && currentNbr >= 100 && endNbr >= 100 ) {newUrl = srcUrl.replace(searchValue,replaceValue)};
        if ( nbrLeadingZeros == "2" && currentNbr < 10 ) {newUrl = srcUrl.replace(searchValue,"00"+replaceValue)};
        if ( nbrLeadingZeros == "2" && currentNbr >= 10 && currentNbr<100 ) {newUrl = srcUrl.replace(searchValue,"0"+replaceValue)};
        if ( nbrLeadingZeros == "2" && currentNbr >= 100 && currentNbr<1000 ) {newUrl = srcUrl.replace(searchValue,replaceValue)};
        //printLL("==F> ", newUrl)
        fullUrls.push(newUrl);
        currentNbr++
    };
};

function replaceTokens (myArray, tokenizedUrl) {
    var nbrOfTokens = myArray.length;
    var searchValue1,replaceValue1 = "";
    var startNbr1,endNbr1,colonNbr1,currentNbr1 = 0; 
    var startNbr2,endNbr2,colonNbr2,currentNbr2 = 0; 
    var leadingZeros1,leadingZeros2 = "a";
    var nbrLeadingZeros1,nbrLeadingZeros2 = 0;
    var token1,token2 = 0;
    var newUrl,tokenizedUrl1,tokenizedUrl2="";

    //TODO: add check to see startNr and EndNbr are valid integers

    printLL("****", ` START replace on ${tokenizedUrl}`);
    //get the token start and end numbers, and set the search values and
    if (nbrOfTokens >= 1) {
        token1 = myArray[0];
        colonNbr1 = token1.indexOf(":");
        startNbr1 = token1.slice(0,colonNbr1);
        endNbr1 = token1.slice(colonNbr1+1);
        currentNbr1 = parseInt(startNbr1); //set the start for loop with currentNbr to the startNbr1
        searchValue1="XX0XX";
        //set nbr of leading 0 in start number for each token
        leadingZeros1 = "0";
        nbrLeadingZeros1 = 0;
        while (startNbr1.startsWith(leadingZeros1.trim())) {
            nbrLeadingZeros1++
            leadingZeros1=leadingZeros1+"0";
        }; 
        printLL("-- ", `${token1} has ${nbrLeadingZeros1} leading 0`);
    };

    if (nbrOfTokens==2) {
        token2 = myArray[1];
        colonNbr2 = token2.indexOf(":");
        startNbr2 = token2.slice(0,colonNbr2);
        endNbr2 = token2.slice(colonNbr2+1);
        currentNbr2 = parseInt(startNbr2); //set the start for loop with currentNbr to the startNbr1
        searchValue2="XX1XX";

        leadingZeros2 = "0";
        nbrLeadingZeros2 = 0;
        while (startNbr2.startsWith(leadingZeros2.trim())) {
            nbrLeadingZeros2++
            leadingZeros2=leadingZeros2+"0";
        } 
        printLL("-- ", `${token2} has ${nbrLeadingZeros2} leading 0`);
    };


    if (nbrOfTokens > 0) {
        //create all numbers between startNbr and endNbr
        //console.log("start loop1: ",currentNbr1," endNumber ", endNbr1);
        while (currentNbr1 <= endNbr1) {  
            //printLL("nbr loop", parseInt(currentNbr1));
            replaceValue1=currentNbr1.toString();
            if ( nbrLeadingZeros1 == "0" ) {                            
                replaceValue1=currentNbr1.toString();
                //printLL("replaceValue", replaceValue1);
                newUrl = tokenizedUrl.replace(searchValue1,replaceValue1);
                if (nbrOfTokens > 1) {replaceTokenUrl(newUrl,searchValue2,startNbr2,endNbr2,nbrLeadingZeros2)};
            };
            if ( nbrLeadingZeros1 == "1" && currentNbr1 < 10 && endNbr1 < 100 ) {
                newUrl = tokenizedUrl.replace(searchValue1,"0"+replaceValue1);
                if (nbrOfTokens > 1) {replaceTokenUrl(newUrl,searchValue2,startNbr2,endNbr2,nbrLeadingZeros2)};
            };
/*             if ( nbrLeadingZeros1 == "1" && currentNbr1 < 10 && endNbr1 >= 100 ) {
                newUrl = tokenizedUrl.replace(searchValue1,"00"+replaceValue1);
                if (nbrOfTokens > 1) {replaceTokenUrl(newUrl,searchValue2,startNbr2,endNbr2,nbrLeadingZeros2)};
            }; */
            if ( nbrLeadingZeros1 == "1" && currentNbr1 >= 10 && currentNbr1<100 && endNbr1 >= 100 ) {
                newUrl = tokenizedUrl.replace(searchValue1,"0"+replaceValue1);
                if (nbrOfTokens > 1) {replaceTokenUrl(newUrl,searchValue2,startNbr2,endNbr2,nbrLeadingZeros2)};
            };
            if ( nbrLeadingZeros1 == "1" && currentNbr1 >= 100 ) {
                newUrl = tokenizedUrl.replace(searchValue1,replaceValue1);
                if (nbrOfTokens > 1) {replaceTokenUrl(newUrl,searchValue2,startNbr2,endNbr2,nbrLeadingZeros2)};
            };
            if ( nbrLeadingZeros1 == "2" && currentNbr1 < 10 ) {
                newUrl = tokenizedUrl.replace(searchValue1,"00"+replaceValue1);
                if (nbrOfTokens > 1) {replaceTokenUrl(newUrl,searchValue2,startNbr2,endNbr2,nbrLeadingZeros2)};
            };
            if ( nbrLeadingZeros1 == "2" && currentNbr1 >= 10 && currentNbr1<100 ) {
                newUrl = tokenizedUrl.replace(searchValue1,"0"+replaceValue1)
            };
            if ( nbrLeadingZeros1 == "2" && currentNbr1 >= 100 && currentNbr1<1000  ) {
                newUrl = tokenizedUrl.replace(searchValue1,replaceValue1)
            };

            if (nbrOfTokens == 1) { //in case there are 2 tokens, the fullUrl is added in the second loop
                //printLL("=L1> ", newUrl);
                fullUrls.push(newUrl);
            }
            currentNbr1++
        };
    };
    return fullUrls;
}

module.exports.identifyTokensInUrl = identifyTokens;
module.exports.generateResolvedUrls = replaceTokens;
module.exports.urlPassVerification = urlPassVerification;
