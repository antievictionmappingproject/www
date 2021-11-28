import groq from "groq";
import { client } from "../../lib/sanity";

export default function Post({ post }) {
  return <div>{post.title}</div>;
}

export async function getStaticProps({ params, locale }) {
  const post = await client.fetch(
    groq`
    *[_type == "post" && slug.current == $slug][0] {
      "title": title[$locale]
    }
  `,
    { slug: params.slug, locale }
  );

  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const postStubs = await client.fetch(groq`
    *[_type == "post"] {
      "slug": slug.current
    }
  `);

  return {
    paths: postStubs.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}
