import groq from "groq";
import { client } from "../../lib/sanity";
import Link from "next/link";

export default function PostIndex({ postStubs }) {
  return (
    <ol>
      {postStubs.map(({ _id, title, slug }) => (
        <li key={_id}>
          <Link href={`/post/${slug}`}>
            <a>{title}</a>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export async function getStaticProps({ locale }) {
  const postStubs = await client.fetch(
    groq`
    *[_type == "post"] {
      "title": title[$locale],
      "slug": slug.current
    }
  `,
    { locale }
  );

  return {
    props: {
      postStubs,
    },
  };
}
