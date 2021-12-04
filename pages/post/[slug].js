import groq from "groq";
import { client } from "../../lib/sanity";
import BlockContent from "@sanity/block-content-to-react";
import Link from "next/link";

export default function Post({ post }) {
  return (
    <article>
      <Link href="/post">
        <a>Back</a>
      </Link>
      <h1>{post.title}</h1>
      <BlockContent blocks={post.body} />
    </article>
  );
}

export async function getStaticProps({ params, locale }) {
  const post = await client.fetch(
    groq`
    *[_type == "post" && slug.current == $slug][0] {
      "title": title[$locale],
      "body": body[$locale]
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
