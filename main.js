// package imports
const fs = require('fs');              //allows operations on files (file stream)
var xml2js = require('xml2js');        //xml parsing

// const path = require('path');       //allows paths for moving files
// const xml = require("xml-parse");   //xml parser module


// variables related to file name. Edit thise before running this script.
// xml file should be named '[sitename]-basic-page.xml'
// change the website variable to [sitename]
const website = 'education';
const fileNameLoc = '1-xml-import/' + website +'-basic-page.xml';
const modFileNameLoc = '2-modified-xml-import/' + website + '-basic-page-modified.xml';

var bodyHtmlString;
var bodyHtmlSubString;


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
        bodyHtml = result.nodes.node[0].Body;
        console.log(bodyHtml);
        var n = bodyHtml.toString().search(/href/i);
        console.log(n + "\n");
        
        
    });

    console.log('\nScript complete.\n');
//You can loop through object properties by using the for-in loop:

//Example
//myObj = { "name":"John", "age":30, "car":null };
//for (i in myObj) {
//    console.log(result.nodes.node[i].Body);
//}
    
});


