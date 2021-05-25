import { Client } from "@notionhq/client";
import { Block } from "@notionhq/client/build/src/api-types";

export const getPageData = async (pageId: string) => {
  const notionClient = getClient();
  const page = await notionClient.pages.retrieve({ page_id: pageId });
  const title =
    page.properties.Name.type === "title"
      ? page.properties.Name.title[0].plain_text
      : undefined;
  const tags =
    page.properties.Tags.type === "multi_select"
      ? page.properties.Tags.multi_select
      : undefined;
  const content = await notionClient.blocks.children.list({ block_id: pageId });

  return { title, tags, content: content.results as Block[] };
};

export const getBlogIndex = async (): Promise<
  { id: string; slug: string }[]
> => {
  const notionClient = getClient();
  const database = await notionClient.databases.query({
    database_id: process.env.INDEX_DATABASE_ID ?? "",
  });
  const result: { id: string; slug: string }[] = [];
  database.results.forEach((page) => {
    if (
      page.properties.slug &&
      page.properties.publishedAt &&
      page.properties.slug.type === "rich_text"
    ) {
      result.push({
        id: page.id,
        slug: page.properties.slug.rich_text[0].plain_text,
      });
    }
  });
  return result;
};

const getClient = () => {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  return notion;
};
