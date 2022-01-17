import React from "react";
import moment from "moment-timezone";

import Container from "../containers/Container";
import Text from "../views/Text";

function NotificationList({ notifications }) {
  return (
    <Container className="column x-fill">
      {notifications.map((notification, index) => {
        return (
          <a
            className={
              "column grey-1 pa16 " +
              (index !== notifications.length - 1 ? "border-bottom" : "")
            }
            key={index}
            href={notification.link}
          >
            <h6>{notification.message}</h6>
            <p className="grey-1 inherit-color">
              {moment(notification.server_timestamp)
                .subtract(1, "minute")
                .fromNow()}
            </p>
          </a>
        );
      })}
      {((notifications && notifications.length === 0) || !notifications) && (
        <Container className="full-center">
          <Text
            className="fw-400 pa16"
            text="There are no notifications to show!"
            type="h6"
          />
        </Container>
      )}
    </Container>
  );
}

export default NotificationList;
