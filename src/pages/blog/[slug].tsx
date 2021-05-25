import { Block, SelectOption } from "@notionhq/client/build/src/api-types";
import { GetStaticProps } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { getBlogIndex, getPageData } from "../../utils/notion";

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

export default function Blog({ post, redirect }: Props) {
  const { replace } = useRouter();

  useEffect(() => {
    if (redirect && !post) {
      replace(redirect);
    }
  }, [redirect, post]);

  return <>{post?.title}</>;
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
    };
  }

  const postData = await getPageData(postId);

  return {
    props: {
      post: postData,
    },
  };
};

export async function getStaticPaths() {
  const blogIndex = await getBlogIndex();

  return {
    paths: blogIndex.map((index) => `/blog/${index.slug}`),
    fallback: true,
  };
}
