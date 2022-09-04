import createSchema from "part:@sanity/base/schema-creator";
import schemaTypes from "all:part:@sanity/base/schema-type";

import location from "./location";
import textSection from "./textSection";
import post from "./post";
import page from "./page";
import author from "./author";
import tag from "./tag";

export default createSchema({
  name: "default",
  types: schemaTypes.concat([textSection, post, page, author, location, tag]),
});
