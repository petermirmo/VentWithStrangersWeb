import db from "../../config/firebase";
import firebase from "firebase/app";
import { combineInsideObjectWithID, getEndAtValueTimestamp } from "../../util";

export const getVents = async (
  pathname,
  setCanLoadMorePosts,
  setVents,
  vents
) => {
  let startAt = getEndAtValueTimestamp(vents);

  let snapshot;
  if (pathname === "trending")
    snapshot = await db
      .collection("/vents/")
      .orderBy("likeCounter", "desc")
      .startAfter(startAt)
      .limitToLast(10)
      .get();
  else
    snapshot = await db
      .collection("/vents/")
      .orderBy("server_timestamp", "desc")
      .startAfter(startAt)
      .limitToLast(10)
      .get();

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newVents = [];
    snapshot.docs.forEach((doc, index) => {
      const value = doc.data();

      newVents.push({ ...doc.data(), id: doc.id, doc });
    });

    if (newVents.length < 10) setCanLoadMorePosts(false);
    if (vents) {
      return setVents(oldVents => {
        if (oldVents) return [...oldVents, ...newVents];
        else return newVents;
      });
    } else {
      return setVents(newVents);
    }
  } else return setCanLoadMorePosts(false);
};

export const getMetaInformation = pathname => {
  let metaTitle = "";
  let metaDescription =
    "People care. Vent and chat anonymously to be apart of a community committed to making the world a better place.";

  if (pathname === "/popular") {
    metaTitle = "Popular";
    metaDescription =
      "Vents and issues that have the most upvotes and comments of all time. Post, comment, and/or like anonymously.";
  } else if (pathname === "/recent") {
    metaTitle = "Recent";
    metaDescription =
      "The latest vents and issues people have posted. Post, comment, and/or like anonymously.";
  } else if (pathname === "/trending") {
    metaTitle = "Trending";
    metaDescription =
      "People’s vents and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.";
  } else {
    metaTitle = "Recent";
    metaDescription =
      "The latest vents and issues people have posted. Post, comment, and/or like anonymously.";
  }
  return { metaDescription, metaTitle };
};
