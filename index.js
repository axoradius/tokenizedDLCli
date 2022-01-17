var printLL = require('printlogline');
var myPath = require('path');
var myFs=require('fs');
const axios = require('axios');
var shortId = require('shortid');
var xUrl=require('url');
var urlCreator = require('./urlDynamicComposer');

var nbrDL = 0; 
var nbrDel = 0;
var nbrNotFound = 0;
var arrayResult;
var dlFolder = "";
var dlFolder="";

function rmFolder(folderDir) {
    myFs.rmSync(folderDir,{ recursive:true,force:true});
}

function generateFileName(url,uID=false) {
    //printLL("",`generate filename for ${myPath.basename(url)}`)
    if (uID === false) {
        var urlToPath = xUrl.parse(url).pathname.replace(/\//g,'-').substring(1); //take full url path after domain name, replace / with - and drop first -
        return urlToPath;
    } else {
        return (shortId.generate() + "_" + myPath.basename(url));
    }
}

function createFolder() {
    var folderName = "dl_"+shortId.generate();
    if (!myFs.existsSync(folderName)) {
        myFs.mkdirSync(folderName);
        console.log(folderName, " created");
    };
    return folderName;
}

async function downloadFile(url,downloadFolder,minSize) { //put a try {} catch {} and in it await calls. This returns a promise with methods like .then
    const fileName = generateFileName(url,false);
    const myAbsPath = myPath.resolve(__dirname,downloadFolder,fileName);

    try {
        const myResponse = await axios({ //execution will wait until this axios call is finished
            method: 'GET',
            url: url,
            responseType: 'stream',
        });     
        const w = myResponse.data.pipe(myFs.createWriteStream(myAbsPath));
        await w.on('finish', () => { //wait for the finish event, but return is already executed --> totals are not correct ... :(           
            var fileSizeKb = myFs.statSync(myAbsPath).size/1024;
            if (fileSizeKb < minSize) {
                //printLL("!!", `delete small file ${fileName}`);
                myFs.unlink(myAbsPath, (err) => {
                    if (err) throw err;
                    printLL("", `${fileName} was deleted`);
                  });
                  nbrDel++
                  return "deleted"; //this is executed before the w.on block is finished.        
            } else {
                printLL("", `downloaded file ${fileName} with ${fileSizeKb} kb`);
                nbrDL++
                return myAbsPath
            }
        })
    } catch (myError) {
        if (myError.response.status == 404 ) {
            nbrNotFound++
            printLL("", `error 404 for ${url}`);
            return `error 404 for ${url}`;
        } else {
            throw new Error (myError);
        }
    }

}

function createArray(nbr){
    var myArray = [];
    var i = 1;
    while (i < (nbr+1)) {
        var addUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+i+".png"
        myArray.push(addUrl);
        i++
    };
    printLL("",`array length is ${myArray.length}`);
    return myArray;
}


function arrayDL(myArray,minSizeKb=50){
    //printLL("","start arrayDL with minSizeKb " + minSizeKb);
    dlFolder = createFolder();

    const dlResults = []; //creer een array waarin je de promises opslaat

    arrayResult = myArray.map((item) => {
        myDlfile = new Promise((resolve) =>{
            let dlResult = downloadFile(item,dlFolder,minSizeKb);
            dlResult.then((dlResultResponse) => {
                //printLL("?? ", dlResultResponse);
                resolve (dlResultResponse);
            })
        });
        return myDlfile;
    });

    Promise.all(arrayResult) // dit werkt niet echt. de laatste DL zijn er niet bij ... de returns komen sneller terug dan het DL eindigt.
    .then(() => {
        printLL("** nbr resolved:   ",`${myArray.length}`);
        printLL("** nbr deleted:    ", nbrDel);
        printLL("** nbr not found:  ", nbrNotFound); 
        printLL("** nbr downloaded: ", nbrDL);
        printLL("workFolder ", dlFolder);
    });
}

//printLL("**"," start remove folder ");
//rmFolder("/Users/bvds/Projects/try01/testPromises/images");

const getInput = require('inquirer');
var questions = [
    {
        type: "input",
        name: "myDlUrl",
        message: "enter the tokenized url: ",
        default: " https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/@1:5@.png"
    },
    {
        type: "input",
        name: "minSizeKb",
        message: "minimum required filesize in KB: ",
        default: "1"
    }
]

getInput.prompt(questions).then(answers => {
    var myTokens = urlCreator.identifyTokensInUrl(answers['myDlUrl']);
    if (myTokens.validStatus) {
        var dlList = urlCreator.generateResolvedUrls(myTokens.tokenArray,myTokens.tokenizedUrl);
        arrayDL(dlList,answers['minSizeKb']);
    } else {
        printLL("!! ERR ",myTokens.msg);
    }
})
