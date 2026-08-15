import Image from "next/image";
import { SkeletonCard } from "../ui/skeleton";
import { Card, CardHeader } from "../ui/card";
import { tv } from "tailwind-variants";
import { GameSession, Player } from "@/services/game/game.types";
import { ChevronRight, CirclePlus } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

type PathListProps = {
  gameList: GameSession['gameList'];
  playerFrom: Player | undefined;
  loading: boolean;
  win: boolean;
};

const card = tv({
  base: "border-0 transition-all",
  variants: {
    overlay: {
      true: "-ml-42.5 border border-gray-400 shadow-lg shadow-black",
    },
    show: {
      true: "hover:scale-105 hover:mr-40 hover:border-0",
    },
  },
});


export default function PathList({ gameList = [], playerFrom, loading, win }: PathListProps) {
  const handledData = [
    ...(gameList.length > 0 ? [gameList[0]] : []),
    ...(gameList.length > 1 ? gameList.slice(1) : []),
    ...(win ? [] : [{ id: -1 } as any]),
    ...(win ? [] : playerFrom ? [playerFrom] : []),
  ].filter(item => item !== undefined)

  if (loading) {
    return (
      <div className="flex gap-4 w-full justify-center items-center">
        {Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={idx} />)}
      </div>
    )
  }

  return (
    <section className="flex gap-4 w-full justify-center items-center">
      {
        handledData.length <= 0 &&
        Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={idx} />)
      }

      {handledData.map((item, idx) => {

        const cardNode = item?.id === -1 ? (
          <Card
            key={-1}
            className="flex justify-center items-center animate-pulse-glow bg-transparent"
          >
            <CirclePlus size={50} className="text-yellow-500" />
          </Card>
        ) : (
          <Card
            key={item.id}
            className={card({
              overlay: handledData.length > 4 && idx > 1 && idx < handledData.length - 1,
              show: handledData.length > 4 && idx > 0 && idx < handledData.length - 2 && (idx !== handledData.length - (win ? 2 : 3)),
            })
            }
          >
            <CardHeader>
              <div className="flex items-center justify-center text-center text-[10px] bg-blue-800 text-white px-2.5">
                <span>{item.country}</span>
              </div>
              {
                Object.hasOwn(item, 'position') && (
                  <div className="flex items-center justify-center text-center text-[10px] bg-green-950 text-white px-2.5">
                    <span>{(item as Player).position}</span>
                  </div>
                )
              }

              {
                Object.hasOwn(item, 'age') && (
                  <div className="flex items-center justify-center text-center text-[10px] bg-green-950 text-white px-2.5">
                    <span className="truncate">{(item as Player).age} years</span>
                  </div>
                )
              }
            </CardHeader>

            <div className="relative w-full h-full border-5 border-white border-t-0 border-b-0">
              <Image
                className="object-cover"
                alt={item?.fullName ?? item.shortName}
                objectFit="contain"
                src={item.image}
                fill
              />
            </div>

            <div className="flex items-center justify-center w-full bottom-2 left-0 text-blue-950 bg-white p-1">
              <span className="uppercase font-bold truncate">
                {item.shortName}
              </span>
            </div>
          </Card>
        );

        return (
          <Fragment key={item?.id ?? idx}>
            {cardNode}
          </Fragment>
        );
      })}
    </section >

  );
}
