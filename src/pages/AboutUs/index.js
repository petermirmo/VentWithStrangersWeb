import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import KarmaBadge from "../../components/KarmaBadge";

import { calculateKarma } from "../../util";

import { isMobileOrTablet } from "../../util";

class AboutUsPage extends Component {
  render() {
    return (
      <Page
        className="bg-grey-2 full-center"
        description=""
        keywords="Learn about Vent With Strangers"
        title="Site Info"
      >
        <h4
          className={
            "box-sizing fw-400 fs-20 " +
            (isMobileOrTablet()
              ? "container mobile-full pa16"
              : "container large px32 pt32")
          }
        >
          People care and help is here. Vent and chat anonymously to be a part
          of a community committed to making the world a better place. This is a
          website for people that want to be heard and people that want to
          listen. Your emotional health is our priority.
        </h4>
        <Container
          className={
            "column bg-white mt16 br8 " +
            (isMobileOrTablet() ? "pa16 mx8" : "container large pa32 ")
          }
        >
          <h4 className="mb16">What Can You Do on VWS?</h4>
          <p className="pl8 mb8">· Chat anonymously with strangers</p>
          <p className="pl8 mb8">
            · Sign up entirely anonymously or use the website without signing up
          </p>
          <p className="pl8 mb8">
            ·{" "}
            <a
              className="no-bold a-tag-common-link"
              href="https://www.ventwithstrangers.com/vent-to-strangers"
            >
              Post on our board anonymously
            </a>
          </p>
          <p className="pl8 mb8">· Comment on our board anonymously</p>
          <p className="pl8 mb8">
            · Tag someone in a post or comment by placing @ before their
            username
          </p>
          <p className="pl8 mb16">· Earn Karma Points</p>

          <h4 className="mb16">What the Heck are Karma Points?</h4>
          <p className="mb16">
            Karma Points are awarded to you when your Vent or comment gets
            upvoted or when you upvote a Vent or comment. Karma Points are taken
            away when you get reported for a valid reason. Be nice and don’t get
            reported!
          </p>
          <h6 className="bold mb16">Karma Points are Awarded as Follows</h6>
          <p className="pl8 mb8">· +4 for an upvote on your comment</p>
          <p className="pl8 mb8">· +2 for an upvote on your vent</p>
          <p className="pl8 mb16">
            · -4 when you get reported for a valid reason
          </p>
          <h6 className="bold mb16">Karma Badges</h6>
          <Container className="flex align-center pl8 mb8">
            <Container className="mr16">
              <KarmaBadge karma={50} />
            </Container>
            <p>Orange Badge @ 50 Karma Points</p>
          </Container>
          <Container className="flex align-center pl8 mb8">
            <Container className="mr16">
              <KarmaBadge karma={100} />
            </Container>
            <p>Red Badge @ 100 Karma Points</p>
          </Container>
          <Container className="flex align-center pl8 mb8">
            <Container className="mr16">
              <KarmaBadge karma={250} />
            </Container>
            <p>Green Badge @ 250 Karma Points</p>
          </Container>
          <Container className="flex align-center pl8 mb8">
            <Container className="mr16">
              <KarmaBadge karma={500} />
            </Container>
            <p>Blue Badge @ 500 Karma Points</p>
          </Container>
          <Container className="flex align-center pl8 mb16">
            <Container className="mr16">
              <KarmaBadge karma={5000} />
            </Container>
            <p>Moderator Title @ 5000 Karma Points</p>
          </Container>
          <h6 className="bold mb16">
            With Great Power Comes Great Responsibility
          </h6>
          <p className="mb16">
            Orange, Red, Green, and Blue badges are milestones while you work
            your way to the Moderator Title. As a Moderator, you will be able to
            edit/delete up to 3 vents and comments a day and also ban 2 users
            per day.
          </p>

          <h4 className="mb16">Where Else Can You Access VWS?</h4>
          <p className="mb8">
            {" "}
            ·{" "}
            <a
              className="underline no-bold a-tag-common-link"
              href="https://apps.apple.com/us/app/vent-with-strangers/id1509120090"
            >
              Apple App Store
            </a>
          </p>
          <p className="mb16">
            {" "}
            ·{" "}
            <a
              className="underline no-bold a-tag-common-link"
              href="https://play.google.com/store/apps/details?id=com.commontech.ventwithstrangers&hl=en"
            >
              Google Play Store
            </a>
          </p>
          <h6 className="bold mb16">Follow Us on Social Media!</h6>
          <Container>
            <a
              className="mr16 mb16"
              href="https://www.instagram.com/ventwithstrangers/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="clickable common-border white round-icon round pa8"
                icon={faInstagram}
                style={{
                  backgroundColor: "#cd486b"
                }}
              />
            </a>
            <a
              className="mr16 mb16"
              href="https://www.facebook.com/ventwithstrangers"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="clickable common-border white round-icon round pa8"
                icon={faFacebook}
                style={{
                  backgroundColor: "#3b5998"
                }}
              />
            </a>
            <a
              className="mr16 mb16"
              href="https://www.linkedin.com/company/vent-with-strangers/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="clickable common-border white round-icon round pa8"
                icon={faLinkedin}
                style={{
                  backgroundColor: "#0e76a8"
                }}
              />
            </a>
          </Container>
        </Container>
      </Page>
    );
  }
}

export default AboutUsPage;
