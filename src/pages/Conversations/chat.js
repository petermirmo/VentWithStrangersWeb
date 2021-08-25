import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { useCollectionData } from "react-firebase-hooks/firestore";
import db from "../../config/firebase";
import firebase from "firebase/app";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";

import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import Container from "../../components/containers/Container";

import Button from "../../components/views/Button";
import Text from "../../components/views/Text";
import KarmaBadge from "../../components/KarmaBadge";
import Message from "./message";

import {
  calculateKarma,
  capitolizeFirstChar,
  isMobileOrTablet
} from "../../util";

import {
  getMessages,
  messageListener,
  sendMessage,
  setConversationIsTyping
} from "./util";
let typingTimer;
let typingTimer2;

function Chat({ conversation, conversationPartnerData = {}, userID }) {
  const [value, setValue] = useState(0); // integer state

  const checkIsUserTyping = isTyping => {
    if (typingTimer2) clearTimeout(typingTimer2);
    if (isTyping) {
      for (let memberID in isTyping) {
        if (memberID !== userID) {
          if (
            firebase.firestore.Timestamp.now().seconds * 1000 -
              isTyping[memberID] <
            4000
          ) {
            typingTimer2 = setTimeout(() => {
              setValue(value => value + 1);
            }, 4000);
            return true;
          } else return false;
        }
      }
    }
  };

  let messageListenerUnsubscribe;

  const dummyRef = useRef();
  const scrollToBottom = () => {
    if (dummyRef.current) dummyRef.current.scrollIntoView();
  };

  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversationID, setConversationID] = useState();
  const [messages, setMessages] = useState([]);
  const [messageString, setMessageString] = useState("");
  const [isUserCurrentlyTyping, setIsUserCurrentlyTyping] = useState(false);
  let messageDivs = [];

  useEffect(() => {
    setCanLoadMore(true);
    setMessages([]);
    getMessages(
      conversation.id,
      messages,
      scrollToBottom,
      setCanLoadMore,
      setMessages
    );

    if (messageListenerUnsubscribe) messageListenerUnsubscribe();
    messageListenerUnsubscribe = messageListener(
      conversation.id,
      scrollToBottom,
      setMessages
    );
    setConversationID(conversation.id);

    return () => {
      if (messageListenerUnsubscribe) messageListenerUnsubscribe();
    };
  }, [conversation.id]);

  let conversationPartnerID;
  if (conversation.members.length === 2)
    conversationPartnerID = conversation.members.find(memberID => {
      return memberID !== userID;
    });

  for (let index in messages) {
    const message = messages[index];
    messageDivs.unshift(
      <Message
        conversationID={conversation.id}
        key={index}
        message={message}
        setMessages={setMessages}
        userID={userID}
      />
    );
  }

  return (
    <Container className="column x-fill full-center bg-white br4">
      <Container className="x-fill border-bottom pa16">
        {conversationPartnerID && (
          <Container className="full-center">
            <Link to={"/profile?" + conversationPartnerID}>
              <h5 className="button-1 mr8">
                {capitolizeFirstChar(conversationPartnerData.displayName)}
              </h5>
            </Link>
            {conversationPartnerData.isUserOnline && (
              <div
                className="mr8"
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: "#1FAB89",
                  borderRadius: "100px"
                }}
              />
            )}
          </Container>
        )}
        {!conversationPartnerID && (
          <h5 className="button-1 mr8">
            {capitolizeFirstChar(conversationPartnerData.displayName)}
          </h5>
        )}
        <KarmaBadge karma={calculateKarma(conversationPartnerData)} />
      </Container>

      <Container className="column x-fill flex-fill ov-auto pa16">
        {canLoadMore && (
          <button
            className="button-2 pa8 mb8 br4"
            onClick={() =>
              getMessages(
                conversation.id,
                messages,
                scrollToBottom,
                setCanLoadMore,
                setMessages,
                false
              )
            }
          >
            Load More Messages
          </button>
        )}
        {!messages ||
          ((messages && messages.length) === 0 && (
            <h4 className="tac">
              The conversation has been started but no messages have been sent!
            </h4>
          ))}

        {messageDivs}

        <div ref={dummyRef} />
      </Container>
      {checkIsUserTyping(conversation.isTyping) && (
        <Container className="x-fill">
          <p className="pa16">
            {conversationPartnerData.displayName} is typing...
          </p>
        </Container>
      )}

      <Container className="column x-fill">
        <Container
          className={
            "x-fill border-top  " +
            (isMobileOrTablet() ? "" : "align-center pr16")
          }
          style={{
            minHeight: isMobileOrTablet() ? "" : "80px"
          }}
        >
          <textarea
            className={
              "send-message-textarea light-scrollbar " +
              (isMobileOrTablet() ? "" : "pa16")
            }
            onChange={event => {
              if (event.target.value === "\n") return;
              setMessageString(event.target.value);

              if (isUserCurrentlyTyping) {
                if (typingTimer) clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                  setIsUserCurrentlyTyping(false);
                }, 2000);
              } else {
                setIsUserCurrentlyTyping(true);
                setConversationIsTyping(conversationID, userID);
              }
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (!messageString) return;
                sendMessage(conversation.id, messageString, userID);
                setMessageString("");
              }
            }}
            placeholder="Type a helpful message here..."
            value={messageString}
          />
          <Button
            className={
              "button-2 " + (isMobileOrTablet() ? "px8 py4" : "px32 py8 br4")
            }
            onClick={() => {
              if (!messageString) return;
              sendMessage(conversation.id, messageString, userID);
              setMessageString("");
            }}
            text="Send"
          />
        </Container>
      </Container>
    </Container>
  );
}

export default Chat;
