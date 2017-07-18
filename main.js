/*
*   CJ Naude
*   secretArchivesLock CodeFights Challenge
*   https://codefights.com/challenge/tuX9NefHfwnPBFZoW
*   July 2017
*/


//Entry point (for testing)
const main = function () {
    //Generate a test array and test instruction string, then display them in the console
    let arr = generateRandomArray();
    let instructions = generateInstructionString();
    prettyPrintArray(arr);
    console.log(instructions);

    //Execute the instructions before optimizing them (so we can confirm the output)
    prettyPrintArray(executeInstructions(arr, instructions));
    
    //Optimize the instruction, run them and output the result
    instructions = optimizeInstructions(instructions);
    arr = executeInstructions(arr, instructions);
    prettyPrintArray(arr);
}

//The function that's actually applying the instruction transformations on the array
//arr   2D array (nested - e.g. [['A']['B']]). Min width and height of 1
//instructionsString    Instruction string containing only "R", "L", "U", "D". Any length
const executeInstructions = function (arr, instructionsString) {
    //Working variables
    let instructionChar;
    let i, j, k;    //Loop vars
    let countArr;
    let processArr;
    let item;
    //Width and height of the input array
    const width = arr[0].length;
    const height = arr.length;

    for (i = 0; i < instructionsString.length; i++) {   //Loop through the instructions
        instructionChar = instructionsString[i];
        switch (instructionChar) {
            case "L": {
                //The count array keeps track of how many items have been shifted in a particular row/column.
                //It uses this number to know where to play the current item in the processArr (which starts of nulled)
                countArr = createArrWithZeroes(height);
                processArr = createEmpty2DArr(width, height);

                for (j = 0; j < height; j++) {
                    for (k = 0; k < width; k++) {
                        item = arr[j][k];
                        if (item !== null) {
                            //Non-null item found, we place it in the countArr[j] index of the current row, then inc countArr[j]
                            processArr[j][countArr[j]] = item;
                            countArr[j]++;
                        }
                    }
                }

                arr = processArr;
                break;
            }
            case "U": {
                //Similar logic to above
                countArr = createArrWithZeroes(width);
                processArr = createEmpty2DArr(width, height);

                for (j = 0; j < height; j++) {
                    for (k = 0; k < width; k++) {
                        item = arr[j][k];
                        if (item !== null) {
                            processArr[countArr[k]][k] = item;
                            countArr[k]++;
                        }
                    }
                }

                arr = processArr;
                break;
            }
            case "R": {
                //Similar logic to above
                countArr = createArrWithZeroes(height);
                processArr = createEmpty2DArr(width, height);

                for (j = 0; j < height; j++) {
                    for (k = 0; k < width; k++) {
                        item = arr[j][width - 1 - k];
                        if (item !== null) {
                            processArr[j][width - 1 - countArr[j]] = item;
                            countArr[j]++;
                        }
                    }
                }

                arr = processArr;
                break;
            }
            case "D": {
                //Similar logic to above
                countArr = createArrWithZeroes(width);
                processArr = createEmpty2DArr(width, height);

                for (j = 0; j < height; j++) {
                    for (k = 0; k < width; k++) {
                        item = arr[height - 1 - j][k];
                        if (item !== null) {
                            processArr[height - 1 - countArr[k]][k] = item;
                            countArr[k]++;
                        }
                    }
                }

                arr = processArr;
                break;
            }
            default: {
                break;
            }
        }
    }

    return arr;
}

//Optimize the instruction string by removing redundant instructions
const optimizeInstructions = function (instructionsString) {
    const optimizeRun = function (instString) {
        //Working variables
        let i;
        let curChar, nextChar;
        let optimizedInstructions = ""; //Keeps the optimized output string

        //Stores the 'opposite' instruction of each instruction, and whether it was
        //the last one called between it and it's opposite
        let instData = {
            "L": {
                opposite: "R",
                calledLast: false
            },
            "R": {
                opposite: "L",
                calledLast: false
            },
            "U": {
                opposite: "D",
                calledLast: false
            },
            "D": {
                opposite: "U",
                calledLast: false
            }
        };
        let oppositeChar;

        for (i = 0; i < instString.length; i++) {   //Loop through the instructions
            //Set the current char and its opposite
            curChar = instString[i];
            oppositeChar = instData[curChar].opposite;

            //See if we aren't at the last instruction, and if not, read the next instruction character
            nextChar = null;
            if ((i + 1) !== instString.length) {
                nextChar = instString[i + 1];
            } 
            //If the next instruction is the opposite of the current, or the same, we can ignore the current instruction
            if ((nextChar === curChar) || (nextChar === oppositeChar)) {
                continue;
            }
            //If the current instruction is the last one called between it and its opposite instruction, we can ignore it
            if (instData[curChar].calledLast) {
                continue;
            }

            //We can't ignore this instruction so we set it as the last called and add it to the output string
            instData[curChar].calledLast = true;
            instData[oppositeChar].calledLast = false;
            optimizedInstructions = optimizedInstructions.concat(curChar);
        }
        return optimizedInstructions;
    }

    //Need to run the opimization twice, as after the first run we can still have redundant instructions
    // (can get opposite instructions next to each other due to 'lastCalled' optimizations)
    return optimizeRun(optimizeRun(instructionsString));
};

// ------------------------------ Generate stuff -----------------------------------
//Receives width and height, returns a 2D nested array of nulls
const createEmpty2DArr = function (w, h) {
    let i, j;
    let tempRow = [];
    let arr = [];
    for (i = 0; i < h; i++) {
        for (j = 0; j < w; j++) {
            tempRow.push(null);
        }
        arr.push(tempRow);
        tempRow = [];
    }
    return arr;
}

//Returns a 1D array filled with zeroes
const createArrWithZeroes = function (l) {
    let i;
    let arr = [];
    for (i = 0; i < l; i++) {
        arr.push(0);
    }
    return arr;
}

const generateRandomArray = function () {   //Generate a random sized 2D array with letters dispersed randomly
    let width = Math.floor((Math.random() * 6) + 5);   //Random number between 5 and 10
    let height = Math.floor((Math.random() * 6) + 5);
    let randomBool;
    let charToInsert = "A";
    let mainArr = [];
    let tempRow = [];
    let i, j;   //Loop vars

    //console.log("Array size: " + width + " x " + height);

    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            randomBool = (Math.random() < 0.7) ? false : true;
            if (randomBool) {
                tempRow.push(charToInsert);
                charToInsert = nextChar(charToInsert);
            }
            else {
                tempRow.push(null);
            }
        }
        mainArr.push(tempRow);
        tempRow = [];
    }

    return mainArr;
}

const nextChar = function (c) {  //Iterates alphabet (Returns b if a is provided)
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

const prettyPrintArray = function (arr2D) {  //Print a 2D array nicely (replacing nulls with #)
    console.log("[ ");
    arr2D.map((row) => {
        row = row.map((item) => {
            return (item === null) ? "#" : item;
        })
        console.log("  " + row.join(" "));
    })
    console.log(" ]");
}

const generateInstructionString = function () {
    let length = Math.floor((Math.random() * 8) + 3);   //Random number between 5 and 10
    let instructionsArray = ["L", "U", "R", "D"];
    let i; //Loop var
    let instructionString = "";
    let instructionChar;

    for (i = 0; i < length; i++) {
        instructionChar = instructionsArray[Math.floor(Math.random() * instructionsArray.length)];  //Get random element of array
        instructionString = instructionString.concat(instructionChar);
    }

    return instructionString;
}


main();