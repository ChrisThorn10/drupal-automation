const files = require('fs');  //allows operations on files (file stream)
const path = require('path'); //allows paths for moving files



//ASYNCHRONOUS FILE DELETION
    /*
    files.unlink('test-delete-async.txt', function(err) {
        if (err) throw err;
        console.log('successfully deleted the test-delete file');

    });
    */


//SYNCHRONOUS FILE DELETION
    /*
    files.unlinkSync('test-delete-sync.txt');
    console.log('successfully deleted the test-delete-sync file');
    */
    

//ASYNC MANIPULATION OF MULTIPLE FILES HAS NO GUARANTEED ORDERING
//IS PRONE TO ERROR. BELOW IS EXAMPLE CODE
    /*
    files.rename('test-delete-async.txt', 'test-delete-async-modified.txt', function(err) {
        if (err) throw err;
        console.log('rename complete.');
    });
    

    files.stat('test-delete-async-modified.txt', function(err, stats) {
        if (err) throw err;
        console.log(`stats: ${JSON.stringify(stats)}`);
    });
    */


//CHAIN CALLBACKS TO ENSURE ASYNC METHODS ARE COMPLETED IN THE CORRECT ORDER
    /*
    files.rename('test-delete-async.txt', 'test-delete-async-modified.txt', function(err) {
        if (err) throw err;
        console.log('rename complete.');
        files.stat('test-delete-async-modified.txt', function(err, stats) {
            if (err) throw err;
            console.log(`stats: ${JSON.stringify(stats)}`);
        });
    });
    */



        