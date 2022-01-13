import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AdSense from "react-adsense";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faUserAstronaut } from "@fortawesome/pro-duotone-svg-icons/faUserAstronaut";

import { UserContext } from "../../context";

import Account from "./Account";
import Avatar from "./Avatar";
import Profile from "./Profile";
import Settings from "./Settings";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

import { isMobileOrTablet, isPageActive, signOut } from "../../util";

function AccountPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const location = useLocation();
  let { pathname, search } = location;

  useEffect(() => {
    if (
      (pathname === "/account" ||
        pathname === "/settings" ||
        pathname === "/avatar") &&
      !user
    )
      navigate.push("/");
  }, [user]);

  return (
    <Page className="bg-grey-2" description="" keywords="" title="Account">
      <Container
        className={
          "x-fill justify-center " + (isMobileOrTablet() ? "py16" : "py32")
        }
      >
        {!isMobileOrTablet() && !search && (
          <Container className="container small column">
            <Container className="x-fill column align-center bg-white px16 mb16 br8">
              <Link className="x-fill" to={"/profile" + search}>
                <Container
                  className={
                    "grid-1 button-4 clickable x-fill align-center py16" +
                    isPageActive("/profile", pathname)
                  }
                >
                  <Container className="flex x-fill full-center">
                    <FontAwesomeIcon icon={faChartNetwork} />
                  </Container>
                  <h5 className="grey-1 inherit-color">Public Profile</h5>
                </Container>
              </Link>

              <Link className="x-fill" to="/account">
                <Container
                  className={
                    "grid-1 button-4 clickable x-fill align-center py16" +
                    isPageActive("/account", pathname)
                  }
                >
                  <Container className="flex x-fill full-center">
                    <FontAwesomeIcon icon={faUser} />
                  </Container>
                  <h5 className="grey-1 inherit-color">Account</h5>
                </Container>
              </Link>
              <Link className="x-fill" to="/avatar">
                <Container
                  className={
                    "grid-1 button-4 clickable x-fill align-center py16" +
                    isPageActive("/avatar", pathname)
                  }
                >
                  <Container className="flex x-fill full-center">
                    <FontAwesomeIcon icon={faUserAstronaut} />
                  </Container>
                  <h5 className="grey-1 inherit-color">Avatar</h5>
                </Container>
              </Link>

              <Link className="x-fill" to="/settings">
                <Container
                  className={
                    "grid-1 button-4 clickable x-fill align-center py16" +
                    isPageActive("/settings", pathname)
                  }
                >
                  <Container className="flex x-fill full-center">
                    <FontAwesomeIcon icon={faCog} />
                  </Container>
                  <h5 className="grey-1 inherit-color">
                    Notifications / Settings
                  </h5>
                </Container>
              </Link>

              <Container className="clickable x-fill align-center pa16">
                <h5
                  className="button-1 grey-1"
                  onClick={() => {
                    signOut(user.uid);
                  }}
                >
                  Sign Out
                </h5>
              </Container>
            </Container>
            {process.env.NODE_ENV === "production" && (
              <Container className="sticky top-0 pa16" style={{ top: "75px" }}>
                <AdSense.Google
                  className="adsbygoogle"
                  client="ca-pub-5185907024931065"
                  format=""
                  responsive="true"
                  slot="1591936277"
                  style={{
                    display: "block",
                    minWidth: "100px",
                    width: "100%",
                    maxWidth: "300px",
                    minHeight: "100px",
                    height: "240px",
                    maxHeight: "800px"
                  }}
                />
              </Container>
            )}
          </Container>
        )}

        <Container className={isMobileOrTablet() ? "x-fill pt16" : ""}>
          {user && pathname === "/account" && <Account user={user} />}
          {user && pathname === "/avatar" && <Avatar user={user} />}
          {pathname === "/profile" && <Profile user={user} />}
          {user && pathname === "/settings" && <Settings user={user} />}
        </Container>
      </Container>
    </Page>
  );
}

export default AccountPage;
