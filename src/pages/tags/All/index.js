import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Container from "../../../components/containers/Container";
import Page from "../../../components/containers/Page";
import SubscribeColumn from "../../../components/SubscribeColumn";

import { useIsMounted, viewTag } from "../../../util";
import { getTags } from "./util";

function AllTags() {
  const isMounted = useIsMounted();

  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags(isMounted, setTags, tags);
  }, []);

  return (
    <Page className="br-grey-2 pt32 px16 pb16">
      <Container>
        <Container className="column flex-fill gap16">
          <h1 className="tac">All Tags</h1>
          <Container className="full-center gap16">
            {tags.map((tag, index) => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </Container>
        </Container>
        <SubscribeColumn slot="3294940691" />
      </Container>
    </Page>
  );
}

function Tag({ tag }) {
  return (
    <Link
      className="button-8 column full-center bg-white br8 gap8 pa32"
      to={`/tags/${tag.id}`}
    >
      <h2 className="ic tac">{tag.display}</h2>
      <p className="ic tac">Uses: {tag.uses ? tag.uses : 0}</p>
    </Link>
  );
}

export default AllTags;
