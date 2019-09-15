// import firebase from 'firebase';
console.log("jooooooooooooooooooooooooooo",firebase)
let db;
let u;
var friends = [];
var pendingreq = [];
var parties=[];

function filter(arr,friends) {
    return arr.filter((x) => {
     if(x.friends===friends){
         return true;
     }
     })
 };

export const addFriend = (f) => {
    return new Promise((res, rej) => {
        db.collection("friends").add({
            uid: u,
            fuid: f,
            status: false
        }).then(() => {
            res.send("Friend added successfully");
        }).catch((err) => rej(err));
    })
}

export const rateMovie = async (arr) => {
    var batch = db.batch();
    for (data of arr) {
        batch.set(db.collection("ratings").doc(), {
            movieid: data.movieid,
            rating: data.rating,
            uid: u
        });
    };
        await batch.commit();
        return true;
};

export const register= (name,profilepic)=>{
    return new Promise((res,rej)=>{
        console.log("in there",u,name,profilepic,db);
         db.collection("users").doc(u).set({
            name,profilepic
        }).then(()=>{
            res(true);
        });
    });

};


export const createWatchParty=(arr,movieid,friends)=>{
   return new Promise((res,rej)=>{
      db.collection("watchparty").doc(u+movieid).set({movieid,invited:arr,initiator:u,friends}).then(()=>{
          res(true);
      }).catch((err)=>{
          rej(err);
      })
   });
}

export const listenWatchParty=(callback,friends)=>{
    db.collection("watchparty").where("invited", "array-contains",u).onSnapshot((snapshot)=>{
           snapshot.forEach((doc)=>{
               parties.push(doc.data());
           });
           if(friends){
            callback(filter(parties,true));
           }else{
             callback(filter(parties,false));
           }
    })
}


export const getPendingreq = (callback) => {
    var promisearr = [];

    db.collection("friends").where("fuid", "==", u).where("status", "==", false).onSnapshot(function (qs) {
        qs.forEach((doc) => {
            promisearr.push(db.collection("users").where("uid", "==", doc.data().uid).get());
        });

        Promise.all(promisearr).then(res => {
            res.forEach((docs) => {
                pendingreq.push([docs.data(), docs.id]);
            });
            callback(pendingreq);
        })

    });
}

export const  acceptFriendreq = (friend) => {
    return new Promise((res, rej) => {
        db.collection("friends").where("fuid", "==", u).where("uid", "==", friend).get().then((docs) => {
            docs.forEach((docr) => {
                db.collection("friends").doc(docr.id).update({
                    status: true
                }).then(() => {
                    res(true);
                }).catch((err) => {
                    rej(err);
                })
            })
        })
    })
}



export const getFriends = (callback) => {
    var promisearr = [];
    db.collection("friends").where("uid", "==", u)
        .onSnapshot(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                promisearr.push(db.collection("users").where("uid", "==", doc.data().fuid).get())
            });
            Promise.all(promisearr).then(res => {
                res.forEach((docs) => {
                    friends.push([docs.data(), docs.id]);
                });
                callback(friends);
            })
        });
}




export const controller = (config, uid) => {
    firebase.initializeApp(config);
    db = firebase.firestore();
    u = uid;
    console.log("firebase domeel");
}

// http://graph.facebook.com/452651015464681/picture?type=large&width=720&height=720