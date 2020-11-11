//alphabetizes an array of objects by some property
export function alphabetizeObjects(arr, prop) {
	return arr.sort((a,b) => (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : -1);
}

//returns inner join of many arrays of objects by some parameter
export function innerJoinObjectsMany(arr, prop)
{
	let result = arr[0];
	for(let i = 1; i < arr.length; i++){
		result = innerJoinObjectsTwo(result, arr[i], prop);
	}
	return result;
}

//returns inner join of two arrays of objects by some parameter
export function innerJoinObjectsTwo(a, b, prop) {
	let c = [];
  for(var i = 0; i < a.length; i++) {
    for(var j = 0; j < b.length; j++){
      if(a[i][prop]===b[j][prop]) {
        c.push(a[i]);
      }
    }
  }
  return c;
}

/*
	"arrSrc" is the array we're looking at to determine what entries are missing etnries
	"arrNew" is the array of entries that we're checking in on
	"propCheck" is the property we're checking for missingness
	"propIdentify" is used to identify entries in arrSrc compared with arrNew
	returns [missingEntries],[foundEntries]
*/
export function sepMissingParams(arrSrc, arrNew, propCheck, propIdentify){
	let arrMissing = [];
	let arrFound = [];
	let foundObj;
	arrNew.forEach(function (elt) {
		foundObj = arrSrc.find(fnd => fnd[propIdentify] === elt[propIdentify]);
		if(foundObj[propCheck] === null){
			arrMissing.push(foundObj);
		}
		else{
			arrFound.push(foundObj);
		}
	});
	return {missing: arrMissing, found: arrFound};
}

/*
	"arrNeedsFilling" is the source array, which has entries for which some property is null
	"arrCanFill" is some array with key,value entries, s.t. these pairs can be used to "repair" the source array
		--note: "arrCanFill" can have more properties than just these keys or values.
	"propFill" is the value in these k,v pairs
	"propIdentify" is the key in these k,v pairs
*/
export function joinMissingParams(arrNeedsFilling, arrCanFill, propFill, propIdentify){
	let foundObj;
	arrNeedsFilling = arrNeedsFilling.slice(); //should ensure shallow copy?
	for(let i = 0; i < arrCanFill.length; i++) {
		foundObj = arrNeedsFilling.find(fnd => fnd[propIdentify] === arrCanFill[i][propIdentify]);
		foundObj[propFill] = arrCanFill[i][propFill];
	};
	return arrNeedsFilling;
}

export function isNumeric(value) {
  return /^-?\d+$/.test(value);
}