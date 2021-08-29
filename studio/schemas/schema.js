import createSchema from "part:@sanity/base/schema-creator";
import schemaTypes from "all:part:@sanity/base/schema-type";

import location from "./location";
import post from "./post";
import page from "./page";
import author from "./author";

export default createSchema({
  name: "default",
  types: schemaTypes.concat([post, page, author, location]),
});
