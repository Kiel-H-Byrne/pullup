import { AspectRatio, Image } from "@chakra-ui/react";
import { PullUp } from "../types";

export const RenderMedia = ({ media, options }: { media: PullUp['media'], options: { title: string, autoplay: boolean } }) => {
  if (media) {
    switch (media.type) {
      case "video":
        //16:9 = 1.778
        //4:3 ==1.333
        return (
          <AspectRatio ratio={1.333} >
            <video controls controlsList="nofullscreen nodownload" preload="metadata" playsInline {...options}><source src={media.uri} />Your browser does not support the video tag.</video>
          </AspectRatio>
        );
        break;
      case "image":
        return <Image src={media.uri} />;
        break;
      case "audio":
        return <audio src={media.uri} />;
        break;

      default:
        console.log(media.type)
        return <div>Unrecognized Media</div>
        break;
    }
  }
};