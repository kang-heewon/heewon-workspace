import {
  Block,
  BulletedListItemBlock,
  HeadingOneBlock,
  HeadingThreeBlock,
  HeadingTwoBlock,
  NumberedListItemBlock,
  ParagraphBlock,
  RichText,
} from "@notionhq/client/build/src/api-types";
import React, { ReactElement, ReactHTML } from "react";

export const paragraphBlock = (block: ParagraphBlock): ReactElement => {
  return createTextElement("p", block.id, block.paragraph);
};

export const headingOneBlock = (block: HeadingOneBlock): ReactElement => {
  return createTextElement("h1", block.id, block.heading_1);
};

export const headingTwoBlock = (block: HeadingTwoBlock): ReactElement => {
  return createTextElement("h2", block.id, block.heading_2);
};

export const headingThreeBlock = (block: HeadingThreeBlock): ReactElement => {
  return createTextElement("h3", block.id, block.heading_3);
};

export const bulletListBlock = (
  blockId: string,
  list: ReactElement[]
): ReactElement => {
  return React.createElement("ul", {
    children: list,
    key: blockId,
  });
};

export const bulletListItemBlock = (
  block: BulletedListItemBlock
): ReactElement => {
  return createTextElement("li", block.id, block.bulleted_list_item);
};

export const numberedListBlock = (
  blockId: string,
  list: ReactElement[]
): ReactElement => {
  return React.createElement("ol", {
    children: list,
    key: blockId,
  });
};

export const numberedListItemBlock = (
  block: NumberedListItemBlock
): ReactElement => {
  return createTextElement("li", block.id, block.numbered_list_item);
};

const createBrElement = (id: string) => {
  return React.createElement("br", { key: id });
};

const createTextElement = (
  tagName: keyof ReactHTML,
  blockId: string,
  block?: {
    text: RichText[];
  }
) => {
  if (block?.text.length === 0) {
    return createBrElement(blockId);
  }

  return React.createElement(tagName, {
    children: block && block.text[0].plain_text,
    key: blockId,
  });
};

export const renderPost = (content: Block[]) => {
  let tempBulletList: ReactElement[] = [];
  let tempNumberedList: ReactElement[] = [];

  return content.map((block, index) => {
    if (block.type === "paragraph") {
      return paragraphBlock(block);
    }
    if (block.type === "heading_1") {
      return headingOneBlock(block);
    }
    if (block.type === "heading_2") {
      return headingTwoBlock(block);
    }
    if (block.type === "heading_3") {
      return headingThreeBlock(block);
    }
    if (block.type === "bulleted_list_item") {
      tempBulletList.push(bulletListItemBlock(block));

      if (
        content.length !== index + 1 &&
        content[index + 1].type !== "bulleted_list_item"
      ) {
        const list = bulletListBlock(block.id, tempBulletList);
        tempBulletList = [];
        return list;
      }
    }
    if (block.type === "numbered_list_item") {
      tempNumberedList.push(numberedListItemBlock(block));
      if (
        content.length - 1 === index ||
        content[index + 1].type !== "numbered_list_item"
      ) {
        const list = numberedListBlock(block.id, tempNumberedList);
        tempNumberedList = [];
        return list;
      }
    }
  });
};
