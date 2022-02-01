import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Space } from "antd";

import Container from "../containers/Container";
import MakeAd from "../MakeAd";
import UniqueShareLink from "../UniqueShareLink";

import { UserContext } from "../../context";

function SubscribeColumn({ slot, uniqueShareLink = true }) {
  const { user, userSubscription } = useContext(UserContext);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState("");

  useEffect(() => {
    import("../../util").then((functions) => {
      setIsMobileOrTablet(functions.getIsMobileOrTablet());
    });
  }, []);

  if (!userSubscription && !isMobileOrTablet)
    return (
      <Container className="container ad column pl16">
        <Container className="sticky top-0 column x-fill">
          {user && !uniqueShareLink && (
            <Space
              className="x-fill full-center bg-white pa16 br8"
              direction="vertical"
            >
              <h4 className="tac">Become a Subscriber</h4>
              <p className="tac">
                Vent With Strangers needs your help. Support our team to build
                the application our community needs. Please consider
                subscribing.
              </p>
              <Link to="/subscribe">
                <Button size="large" type="primary">
                  Subscribe For $1/Month
                </Button>
              </Link>
            </Space>
          )}
          {uniqueShareLink && <UniqueShareLink user={user} />}
          <MakeAd
            className="mt16"
            slot={slot}
            userSubscription={userSubscription}
          />
        </Container>
      </Container>
    );
  else return <div style={{ display: "none" }} />;
}

export default SubscribeColumn;
