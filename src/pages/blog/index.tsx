import { getBlogIndex } from "@utils/notion";
import { GetStaticProps } from "next";

type Props = {
  blogIndex: { id: string; slug: string; title: string }[];
};
export default function Blog({ blogIndex }: Props) {
  return (
    <>
      {blogIndex.map((index) => (
        <a key={index.id} href={`/blog/${index.slug}`}>
          <p>{index.title}</p>
        </a>
      ))}
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const blogIndex = await getBlogIndex();

  return {
    props: {
      blogIndex,
    },
  };
};
