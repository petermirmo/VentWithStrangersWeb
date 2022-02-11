import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import {
  get,
  limitToLast,
  orderByChild,
  query as query2,
  ref,
} from "firebase/database";
import { db, db2 } from "../../config/db_init";
import { getEndAtValueTimestamp } from "../../util";

export const getMetaInformation = (pathname) => {
  let metaTitle = "";
  if (pathname === "/recent") {
    metaTitle = "Recent Vents";
  } else if (pathname === "/my-feed") {
    metaTitle = "My Feed";
  }

  return { metaTitle };
};

export const getVents = async (
  isMounted,
  pathname,
  setCanLoadMore,
  setVents,
  user,
  vents
) => {
  let startAt = getEndAtValueTimestamp(vents);

  let snapshot;
  let snapshotRTDB;
  if (pathname === "/recent") {
    snapshot = await getDocs(
      query(
        collection(db, "vents"),
        orderBy("server_timestamp", "desc"),
        startAfter(startAt),
        limit(10)
      )
    );
  } else if (pathname === "/my-feed" && user) {
    snapshotRTDB = await get(
      query2(
        ref(db2, "feed/" + user.uid),
        limitToLast(10),
        orderByChild("server_timestamp")
      )
    );
  } else {
    let trending_option = "trending_score_day";
    if (pathname === "/trending/this-week")
      trending_option = "trending_score_week";
    if (pathname === "/trending/this-month")
      trending_option = "trending_score_month";

    snapshot = await getDocs(
      query(
        collection(db, "vents"),
        orderBy(trending_option, "desc"),
        startAfter(startAt),
        limit(10)
      )
    );
  }
  if (!isMounted()) return;

  if (snapshot && snapshot.docs && snapshot.docs.length > 0) {
    let newVents = snapshot.docs.map((doc, index) => ({
      doc,
      id: doc.id,
      ...doc.data(),
    }));

    if (newVents.length < 10) setCanLoadMore(false);
    if (vents) {
      return setVents((oldVents) => {
        if (oldVents) return [...oldVents, ...newVents];
        else return newVents;
      });
    } else {
      return setVents(newVents);
    }
  } else if (snapshotRTDB && snapshotRTDB.val()) {
    const data = snapshotRTDB.val();
    let ventIDs = [];

    for (let index in data) {
      ventIDs.push(index);
      console.log(data[index].server_timestamp);
    }

    console.log(ventIDs.length);
    if (isMounted()) {
      if (ventIDs.length < 10) setCanLoadMore(false);

      setVents(ventIDs);
    }
  } else return setCanLoadMore(false);
};

export const newVentListener = (
  isMounted,
  pathname,
  setWaitingVents,
  first = true
) => {
  if (pathname !== "/recent") return;

  const unsubscribe = onSnapshot(
    query(
      collection(db, "vents"),
      orderBy("server_timestamp", "desc"),
      limit(1)
    ),
    (querySnapshot) => {
      if (first) {
        first = false;
      } else if (querySnapshot.docs && querySnapshot.docs[0]) {
        if (
          querySnapshot.docChanges()[0].type === "added" ||
          querySnapshot.docChanges()[0].type === "removed"
        ) {
          if (isMounted())
            setWaitingVents((vents) => [
              ...vents,
              {
                doc: querySnapshot.docs[0],
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data(),
              },
            ]);
        }
      }
    }
  );

  return unsubscribe;
};
