// import firebase from 'firebase';
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

 const addFriend = (f) => {
    return new Promise((res, rej) => {
        db.collection("friends").doc().set({
            uid: u,
            fuid: f,
            status: false
        }).then(() => {
            res("Friend added successfully");
        }).catch((err) => rej(err));
    })
}

 const rateMovie = async (arr) => {
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

const register= (name,profilepic)=>{
    return new Promise((res,rej)=>{
         db.collection("users").doc(u).set({
            name,profilepic
        }).then(()=>{
            res(true);
        });
    });

};


const createWatchParty=(arr,movieid,friends)=>{
   return new Promise((res,rej)=>{
      db.collection("watchparty").doc(u+movieid).set({movieid,invited:arr,initiator:u,friends}).then(()=>{
          res(true);
      }).catch((err)=>{
          rej(err);
      })
   });
}

  const listenWatchParty=(callback,friends)=>{
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


 const getPendingreq = (callback) => {
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

const acceptFriendreq = (friend) => {
    return new Promise((res, rej) => {
        db.collection("friends").where("uid", "==", u).where("fuid", "==",friend).get().then((docs) => {
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



const getFriends = (callback) => {
    var switcher = false;
    db.collection("friends").where("uid", "==", u)
        .onSnapshot(function (querySnapshot) {
            querySnapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {
                }
                if (change.type === "modified") {
                }
                if (change.type === "removed") {
                }
            });






            switcher = true;
            querySnapshot.docs.forEach(function (doc, i,arr) {
                let requestStatus=doc.data().status;
                db.collection("users").doc(doc.data().fuid).onSnapshot((docs) => {
                    friends = friends.filter(x => {
                        return x[1] != docs.id
                    }) || [];
                    let payload=doc.data();
                    payload.status=requestStatus;
                    friends.push([payload, docs.id]);
                    console.log(switcher);
                    console.log(querySnapshot.docs.length,i);
                    if (!switcher)
                        callback(friends);
                    if (switcher) {
                        if (arr.length == i+1) {
                            callback(friends);
                            switcher = false;
                        }
                    }
                });

            });
        });
}

const search=(frname,page,callback)=>{
    db.collection("users").where("name","==",frname).limit(5*page).get().then((snap)=>{
        var myarr=[];
        snap.forEach((doc)=>{
            myarr.push(doc.data());
        });
        myarr.slice(page*5-4,page*5+1);
        callback(myarr);  
    });
}




export const controller = (config, uid) => {
    firebase.initializeApp(config);
    db = firebase.firestore();
    u = uid;
    return {
        getFriends,register,addFriend,acceptFriendreq,search
    }
}

// http://graph.facebook.com/452651015464681/picture?type=large&width=720&height=720