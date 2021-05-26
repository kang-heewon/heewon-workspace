import { Block, SelectOption } from "@notionhq/client/build/src/api-types";
import { getBlogIndex, getPageData } from "@utils/notion";
import { renderPost } from "@utils/renderer";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Query = {
  slug: string;
};
type Props = {
  redirect?: string;
  post?: {
    title?: string;
    tags?: SelectOption[];
    content: Block[];
  };
};

export default function Article({ post, redirect }: Props) {
  const { replace } = useRouter();

  useEffect(() => {
    if (redirect && !post) {
      replace(redirect);
    }
  }, [redirect, post]);

  if (!post) {
    return <div></div>;
  }
  return (
    <>
      <div>
        <h1>{post.title ?? ""}</h1>

        <hr />

        {renderPost(post.content)}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({
  params,
}) => {
  const blogIndex = await getBlogIndex();
  const postId = blogIndex.find((index) => index.slug === params?.slug)?.id;

  if (!postId || !params?.slug) {
    return {
      props: {
        redirect: "/blog",
      },
      revalidate: 5,
    };
  }

  const postData = await getPageData(postId);

  return {
    props: {
      post: postData,
    },
    revalidate: 10,
  };
};

export async function getStaticPaths() {
  const blogIndex = await getBlogIndex();

  return {
    paths: blogIndex.map((index) => `/blog/${index.slug}`),
    fallback: true,
  };
}
