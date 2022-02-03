const admin = require("firebase-admin");

const calculateKarma = (usereBasicInfo) => {
  return usereBasicInfo.karma ? usereBasicInfo.karma : 0;
};

const calculateKarmaUserCanStrip = (usereBasicInfo) => {
  return 30;
  if (!usereBasicInfo) return 5;

  if (usereBasicInfo.karma > 1000) return 200;
  else if (usereBasicInfo.karma > 500) return 100;
  else if (usereBasicInfo.karma > 250) return 50;
  else if (usereBasicInfo.karma > 100) return 20;
  else if (usereBasicInfo.karma > 50) return 10;
  else if (usereBasicInfo.karma > 0) return 5;
};

const capitolizeFirstChar = (string) => {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else return;
};

const combineObjectWithID = (id, object) => {
  object.id = id;
  return object;
};

const createBirthdayLink = () => {
  return "/birthday-post";
};

const createRewardsLink = () => {
  return "/rewards";
};

const createVentLink = (vent) => {
  return (
    "/vent/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase()
  );
};

const getMetaInformation = async (url, callback) => {
  let description = "";
  let keywords = "";
  let title = "";

  let vent;

  const questionMarkID = url.substring(
    url.lastIndexOf("?") + 1,
    url.length - 1
  );
  const slashID = url.substring(url.lastIndexOf("/") + 1, url.length);

  if (url.substring(0, 5) === "/vent" && slashID) {
    const ventDoc = await admin
      .firestore()
      .collection("vents")
      .doc(slashID)
      .get();
    vent = ventDoc.data();

    if (vent) {
      description = vent.description ? vent.description.substring(0, 140) : "";
      title = vent.title ? vent.title.substring(0, 60) : "";
      vent = { id: ventDoc.id, ...vent };
    }
  } else if (url.substring(0, 9) === "/profile?" && questionMarkID) {
    const userDoc = await admin
      .firestore()
      .collection("users_display_name")
      .doc(questionMarkID)
      .get();

    if (userDoc && userDoc.data() && userDoc.data().displayName) {
      title =
        capitolizeFirstChar(userDoc.data().displayName) +
        "'s Profile and Recent Activity";
    }
  } else if (url.substring(0, 5) === "/tags" && slashID) {
    const ventTagDoc = await admin
      .firestore()
      .collection("vent_tags")
      .doc(slashID)
      .get();

    if (ventTagDoc.data()) {
      description =
        "Read vents about " +
        ventTagDoc.data().display.toLowerCase() +
        ". Vent With Strangers is a safe place where people can talk about their problems and receive positive constructive feedback.";
      keywords = ventTagDoc.data().display.toLowerCase();
      title = "Vents About " + ventTagDoc.data().display;
    }
  } else if (url.substring(0, 5) === "/tags" && !slashID) {
    description =
      "Read vents on any of our tags. Vent With Strangers is a safe place where people can talk about their problems and receive positive constructive feedback.";
    keywords = "anxiety,bullying,depression,family,school";
    title = "View Vents Based on Anxiety, Bullying, Depression and More";
  } else if (url === "/") {
    description =
      "Vent online with strangers. VWS is a site where you can make friends and get help on your specific situation all for free. Our site is 100% anonymous.";
    keywords =
      "vent online,vent to someone,vent app,I need to vent,anonymous chat,talk to strangers, chat rooms, chat with strangers";
    title = "Vent and Chat Anonymously With Strangers";
  } else if (url === "/account") {
    title = "Account";
  } else if (url === "/avatar") {
    title = "Avatar";
  } else if (url === "/birthday-post") {
    title = "Happy Birthday!";
  } else if (url === "/chat-with-strangers") {
    description =
      "Chat anonymously with great strangers. Our site is free of bullies, bots and perverts. Everything is 100% free and no credit card is required.";
    keywords =
      "anonymously chat,random chat,vent chat,chat rooms,chat with strangers";
    title = "Chat With Strangers";
  } else if (url === "/chat") {
    description = "Your inbox.";
    keywords = "";
    title = "Chat";
  } else if (url === "/make-friends") {
    description =
      "Making friends online has never been easier. After filling out your profile we will match you with like minded people! :)";
    keywords = "make friends online,make friends,make friends app";
    title = "Make Friends";
  } else if (url === "/people-online") {
    description =
      "The help you have been looking for is here. These are people online right now. Start chatting with real and kind people.";
    keywords = "";
    title = "Current People Online On Vent With Strangers";
  } else if (url === "/profile") {
    title = "Profile";
  } else if (url === "/privacy-policy") {
    title = "Privacy Policy";
  } else if (url === "/quote-contest") {
    description =
      "View geel good quotes. We have a daily contest to see who can create the best feel good quote. View past winners and all quotes.";
    keywords = "feel good quotes";
    title = "Feel Good Quotes";
  } else if (url === "/recent") {
    title = "Recent Vents";
  } else if (url === "/rewards") {
    description =
      "Earning rewards is lots of fun on Vent With Strangers. View this page to know how far away your milestones are! :)";
    keywords = "";
    title = "Your Rewards";
  } else if (url === "/rules") {
    description =
      "Vent With Strangers is a safe and secure place. Our rules are very easy to follow :) Be nice and you will be totally fine!";
    keywords = "";
    title = "VWS Rules";
  } else if (url === "/search") {
    title = "Search";
  } else if (url === "/settings") {
    title = "Settings";
  } else if (url === "/site-info") {
    description =
      "Our site is awesome. You can, chat with strangers, create anonymous vents, create an avatar and more :) Read about it here!";
    keywords = "vent with strangers, chat anonymously, chat online";
    title = "Vent With Strangers Rules Info";
  } else if (url === "/trending") {
    title = "Trending Vents";
  } else if (url === "/vent-to-strangers") {
    description =
      "You are not alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you.";
    keywords = "vent to strangers,vent to someone,chat with strangers";
    title = "Vent To Strangers";
  }
  return callback(
    {
      description,
      keywords,
      title,
    },
    Boolean(title),
    vent
  );
};

const getInvalidDisplayNameCharacters = (displayName) => {
  const invalidCharactersArray = displayName.split(
    /[\x30-\x39|\x41-\x5A|\x61-\x7a|\x5F]+/gi
  );
  let invalidCharacters = "";

  for (let index in invalidCharactersArray) {
    invalidCharacters += invalidCharactersArray[index];
  }
  return invalidCharacters;
};

const updateTotalUsersOnline = (change, context) => {
  const setToDatabase = (state) => {
    if (state === "online") {
      admin
        .database()
        .ref("total_online_users")
        .set(admin.database.ServerValue.increment(1));
    } else if (state === "offline") {
      admin
        .database()
        .ref("total_online_users")
        .set(admin.database.ServerValue.increment(-1));
    }
  };

  const changeAfter = change.after;
  const changeBefore = change.before;

  if (changeAfter.val() && !changeAfter.val().last_online) {
    admin
      .database()
      .ref("status/" + context.params.userID)
      .update({ last_online: admin.database.ServerValue.TIMESTAMP });
  }

  if (!changeAfter.val() && !changeBefore.val()) {
    // Do nothing, should never happen
  } else if (!changeBefore.val()) {
    // New doc
    // console.log("new doc");

    if (changeAfter.val().state === "online")
      setToDatabase(changeAfter.val().state);
  } else if (!changeAfter.val()) {
    // Doc deleted
    // console.log("doc deleted");

    setToDatabase(changeBefore.val().state === "online" ? "offline" : "");
  } else {
    // Doc updated
    // console.log("doc updated");

    if (changeBefore.val().state !== changeAfter.val().state) {
      // console.log("updated with different values");
      setToDatabase(changeAfter.val().state);
    }
  }
  return 10;
};

module.exports = {
  calculateKarma,
  calculateKarmaUserCanStrip,
  combineObjectWithID,
  createBirthdayLink,
  createRewardsLink,
  createVentLink,
  getMetaInformation,
  updateTotalUsersOnline,
};
