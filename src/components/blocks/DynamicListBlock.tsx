import { DynamicListBlock as DynamicListBlockType, Media } from "@/payload-types";
import Card from "../Card";
import Heading from "../Heading";
type Props = {
  block: DynamicListBlockType;
};

type ImageItemType = {
  id?: string | number;
  image?: number | Media | null;
};

const getImageData = (item: ImageItemType): Media | undefined => {
  if ("image" in item) {
    return typeof item.image === "object" ? item.image || undefined : undefined;
  }
  return undefined;
};

export default function DynamicListBlock({ block }: Props) {
  const items = block.items?.map((item) => item.reference.value);
  if (!items) return;

  return (
    <div className="my-24 w-full">
      {block.blockName && (
        <Heading level="h2" size="md">
          {block.blockName}
        </Heading>
      )}
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item, index) => {
          if (!item || typeof item === "number") return null;
          return (
            <li key={item.slug + index}>
              <Card
                title={item.title}
                href={`/${item.collection}/${item.slug}`}
                image={getImageData(item)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
