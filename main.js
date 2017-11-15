// package imports
var fs = require('fs');              //allows operations on files (file stream)
var xml2js = require('xml2js');        //xml parsing
var cheerio = require('cheerio');
var sanitizeHtml = require('sanitize-html');

// const path = require('path');       //allows paths for moving files
// const xml = require("xml-parse");   //xml parser module



// variables related to file name. Edit thise before running this script.
// xml file should be named '[sitename]-basic-page.xml'
// change the website variable to [sitename]
var website = 'education';
var fileNameLoc = '1-xml-import/' + website +'-basic-page.xml';
var modFileNameLoc = '2-modified-xml-import/' + website + '-basic-page-modified.xml';


var bodyHtmlObject;         //html object
var bodyHtmlString;         //html string
var bodyHtmlSubString;      //subset of text from within the html string






// copy the file from the import folder (1) and paste it to the new location (2) using a new filename
fs.createReadStream(fileNameLoc)
    .pipe(fs.createWriteStream(modFileNameLoc));



// read the newly created file and store it in the 'data' variable as an object
fs.readFile(modFileNameLoc, (err, data) => {
    if (err) throw err;
    //console.log(data.toString());

    
    
    // create a new parser 
    var parser = new xml2js.Parser(); 
   
    
    
    // pares file into object notation
    parser.parseString(data, function (err, result) {
        
        //console.dir(JSON.stringify(result));
        console.log("\nThere are " + result.nodes.node.length + " pages being parsed.\n");
        bodyHtmlObject = result.nodes.node[1].Body[0];
        console.log(bodyHtmlObject);
        bodyHtmlString = bodyHtmlObject.toString();    
    });

    
// You can loop through object properties by using the for-in loop:

// Example
// myObj = { "name":"John", "age":30, "car":null };
// for (i in myObj) {
//    console.log(result.nodes.node[i].Body);
// }
    
    
    //variable used to load html into cherio
    
    correctLinkTargets();
    console.log('\nScript complete.\n');
});



// functions for parsing and updating html content
function removeSpans() {
    const $ = cheerio.load(bodyHtmlObject);
    //$('span').contents().unwrap();
    //$('h2').addClass('welcome');
    console.log("\n *************** \n");
    console.log($.html());
    console.log('In the removeSpans() function.');

//=> <h2 class="title welcome">Hello there!</h2>
//$div.find(".find-me").remove();
//console.log($div);    
    
}

function correctLinkTargets() {
    const $ = cheerio.load(bodyHtmlObject);
    //$('a').contents().unwrap();
    //$('h2').addClass('welcome');
    console.log("\n *************** \n");
    console.log($.html());
    console.log('In the correctLinkTargets() function.');

//=> <h2 class="title welcome">Hello there!</h2>
//$div.find(".find-me").remove();
//console.log($div);    
    
}