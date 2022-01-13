import React, { useContext, useEffect, useState } from "react";
import { message, Space } from "antd";
import TextArea from "react-textarea-autosize";
import { useNavigate } from "react-router-dom";

import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../context";

import Container from "../containers/Container";
import Emoji from "../Emoji";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import MakeAvatar from "../../components/MakeAvatar";
import StarterModal from "../modals/Starter";

import { useIsMounted, userSignUpProgress } from "../../util";
import {
  countdown,
  getUserVentTimeOut,
  getVent,
  saveVent,
  selectEncouragingMessage,
  updateTags,
} from "./util";

function NewVentComponent({ miniVersion, ventID }) {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { user, userBasicInfo } = useContext(UserContext);

  const [isMinified, setIsMinified] = useState(miniVersion);
  const [description, setDescription] = useState("");
  const [encouragingText] = useState(selectEncouragingMessage());
  const [saving, setSaving] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [title, setTitle] = useState("");
  const [userVentTimeOut, setUserVentTimeOut] = useState(false);

  let userVentTimeOutFormatted;
  if (userVentTimeOut)
    userVentTimeOutFormatted = userVentTimeOut.format("hh:mm:ss");

  useEffect(() => {
    if (ventID) getVent(setDescription, setTags, setTitle, ventID);
    if (user)
      getUserVentTimeOut((res) => {
        if (res) {
          countdown(isMounted, setUserVentTimeOut, res);
          setInterval(
            () => countdown(isMounted, setUserVentTimeOut, res),
            1000
          );
        }
      }, user.uid);
  }, [isMounted, user, ventID]);

  const checks = () => {
    if (userVentTimeOut && !ventID) return false;
    const userInteractionIssues = userSignUpProgress(user);

    if (userInteractionIssues) {
      if (userInteractionIssues === "NSI") setStarterModal(true);
      return false;
    }

    return true;
  };

  return (
    <HandleOutsideClick
      className="x-fill column bg-white br8"
      close={() => {
        if (miniVersion) setIsMinified(true);
      }}
    >
      <Space className="pa32 br4" direction="vertical" size="large">
        {!miniVersion && userVentTimeOut && !ventID && (
          <Space direction="vertical">
            <p className="tac">
              To avoid spam, people can only post once every few hours. With
              more Karma Points you can post more often. Please come back in
            </p>
            <h1 className="tac">{userVentTimeOutFormatted}</h1>
          </Space>
        )}
        <Space className="x-fill" direction="vertical">
          <Container className="align-center">
            <MakeAvatar userBasicInfo={userBasicInfo} />
            <TextArea
              className="x-fill py8 px16 br4"
              onChange={(event) => {
                if (!checks()) return;

                setDescription(event.target.value);
              }}
              onClick={() => setIsMinified(false)}
              placeholder={
                userVentTimeOut
                  ? selectEncouragingMessage(userVentTimeOutFormatted)
                  : encouragingText
              }
              minRows={isMinified ? 1 : 3}
              value={description}
            />
            <Emoji
              handleChange={(emoji) => {
                const userInteractionIssues = userSignUpProgress(user);

                if (userInteractionIssues) {
                  if (userInteractionIssues === "NSI") setStarterModal(true);
                  return;
                }

                setDescription(description + emoji);
              }}
            />
          </Container>
        </Space>
        {!isMinified && (
          <Space className="x-fill" direction="vertical">
            <h5 className="fw-400">Title</h5>
            <input
              className="x-fill py8 px16 br4"
              onChange={(e) => {
                if (!checks()) return;
                setTitle(e.target.value);
                setSaving(false);
              }}
              placeholder="Our community is listening :)"
              type="text"
              value={title}
            />
          </Space>
        )}
        {!isMinified && (
          <Space className="x-fill" direction="vertical">
            <h5 className="fw-400">Tag this vent</h5>

            <input
              className="x-fill py8 px16 br4"
              onChange={(e) => {
                if (!checks()) return;

                updateTags(
                  checks,
                  e.target.value,
                  setSaving,
                  setStarterModal,
                  setTags,
                  setTagText,
                  tags,
                  user
                );
              }}
              placeholder="depression, relationships, bullying, school, parents"
              type="text"
              value={tagText}
            />
          </Space>
        )}
        {!isMinified && (
          <Space className="x-fill" wrap>
            {tags.map((tag, index) => {
              let text = tag;
              if (tag.name) text = tag.name;

              return (
                <Container
                  key={index}
                  className="clickable"
                  onClick={() => {
                    let temp = [...tags];
                    temp.splice(index, 1);

                    setSaving(false);
                    setTags(temp);
                  }}
                >
                  <p
                    className="flex-fill tac fw-300 border-all blue active large px16 py8"
                    style={{
                      marginRight: "1px",
                      borderTopLeftRadius: "4px",
                      borderBottomLeftRadius: "4px",
                    }}
                  >
                    {text}
                  </p>
                  <Container
                    className="full-center border-all px16"
                    style={{
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                    }}
                  >
                    <FontAwesomeIcon className="" icon={faTimes} />
                  </Container>
                </Container>
              );
            })}
          </Space>
        )}

        {!isMinified && (
          <Container className="justify-end">
            {!saving && (
              <button
                className="bg-blue white px64 py8 br4"
                onClick={() => {
                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI") setStarterModal(true);
                    return;
                  }

                  if (tagText) tags.push(tagText);
                  if (description && title) {
                    setTagText("");
                    setSaving(true);

                    saveVent(
                      (vent) => {
                        setSaving(false);
                        navigate(
                          "/problem/" +
                            vent.id +
                            "/" +
                            vent.title
                              .replace(/[^a-zA-Z ]/g, "")
                              .replace(/ /g, "-")
                              .toLowerCase()
                        );
                      },
                      checks,
                      {
                        description,
                        tags,
                        title,
                      },
                      ventID,
                      user
                    );
                  } else message.error("One or more fields is missing :'(");
                }}
              >
                Submit
              </button>
            )}
          </Container>
        )}
      </Space>
      {!miniVersion && (
        <Container
          className="column pa32"
          style={{ borderTop: "2px solid var(--grey-color-2)" }}
        >
          <p>
            If you or someone you know is in danger, call your local emergency
            services or police.
          </p>
        </Container>
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </HandleOutsideClick>
  );
}

export default NewVentComponent;
