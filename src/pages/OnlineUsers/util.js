import firebase from "firebase/compat/app";
import "firebase/compat/database";

export const getOnlineUsers = (isMounted, callback, totalOnlineUsers) => {
  if (totalOnlineUsers > 0)
    firebase
      .database()
      .ref("status")
      .orderByChild("state")
      .limitToLast(totalOnlineUsers)
      .once("value", (snapshot) => {
        let usersArray = [];

        snapshot.forEach((data) => {
          if (data.val().state === "online") {
            usersArray.push({
              lastOnline: data.val().last_online,
              userID: data.key,
            });
          }
        });

        usersArray.sort((a, b) => {
          if (a.lastOnline < b.lastOnline || !a.lastOnline) return 1;
          if (a.lastOnline > b.lastOnline || !b.lastOnline) return -1;
          return 0;
        });
        if (isMounted()) callback(usersArray);
      });
};
