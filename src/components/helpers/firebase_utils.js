import db from '../services/Firebase/Firebase.js';
import { getDocs, collection, doc, writeBatch, getDoc, query, where} from "firebase/firestore";

class Game {
  constructor (appid, fieldsString) {
    this.appid = appid;
    this.fieldsString = fieldsString;
  }
  toString(){
    return this.appid + ', ' + this.fieldsString;
  }
}

const gameConverter = {
  toFirestore: (game) => {
    return {
      appid: game.appid,
      fieldsString: game.fieldsString
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Game(data.appid, data.fieldsString);
  }
};

//takes appid as string, gets document
export const getSingleGameFirebase = async (appid) => {
  const ref = doc(db, "gamesData", appid).withConverter(gameConverter);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    // Convert to Game object
    const game = docSnap.data();
    // Use a Game instance method
    console.log(game.toString());
  } else {
    console.log("No such document!");
  }
}

//takes array of appids as integers, gets documents
export const getMultipleGamesFirebase = async (gamesList) => {
  const gamesArray = [];
  const idsArray = [];
  
  console.log("About to pull from firebase " + Math.ceil(gamesList.length / 10) + " times.");
  while(gamesList.length){
    const currSplice = gamesList.splice(0,10);
    const q = query(collection(db, "gamesData"), where('appid', 'in', currSplice)).withConverter(gameConverter);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      const game = doc.data();
      gamesArray.push(game);
      idsArray.push(game.appid);
      //console.log ("Attempting to pull appids [" + currSplice + "] from Firebase");
    });
  }
  return [gamesArray, idsArray];
}

export const setMultipleGamesFirebase = async (gamesList) => {
  const batch = writeBatch(db);
  const refArr = [];
  for(let i = 0; i < gamesList.length; i++){
    let newRef = null;
    try {
      newRef = doc(db, "gamesData", gamesList[i].name);
    } catch (error) {
      newRef = doc(db, "gamesData", gamesList[i].appid.toString());
    }
    refArr.push(newRef);
    batch.set(refArr[i], {"fieldsString": gamesList[i].flags, "appid": gamesList[i].appid});
  }

  console.log("Pushing firebase game data...");
  await batch.commit();
}