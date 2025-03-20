import { parseLink } from "@/lib/parse-link";
import { LargeFeaturedPostBlock as LargeFeaturedPostBlockType } from "@/payload-types";
import Image from "next/image";
import Button from "../Button";
import Heading from "../Heading";

type Props = {
  block: LargeFeaturedPostBlockType;
};

export function LargeFeaturedPostBlock({ block }: Props) {
  const { linkUrl, linkLabel } = parseLink(block.link);
  return (
    <div className="my-24 text-center">
      <div className="grid items-center overflow-hidden rounded-xl bg-stone-800 sm:grid-cols-2">
        {typeof block.image === "object" && block.image.url && (
          <div className="relative aspect-video w-full sm:aspect-square">
            <Image
              src={block.image.url}
              alt={block.image.alt || block.title || ""}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="p-8">
          <Heading level="h2" size="lg">
            {block.title}
          </Heading>
          <p className="text-lg leading-relaxed text-stone-300">{block.text}</p>
          {linkUrl && (
            <div className="mt-14 flex justify-center">
              <Button href={linkUrl} style="secondary">
                {linkLabel || "Read more"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
