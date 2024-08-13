"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Chip } from "@nextui-org/chip";

import { title, subtitle } from "@/components/primitives";
import GameCard from "@/components/shared/gamecard";
import { courses, games } from "@/config/course";
import TargetCard from "@/components/shared/targetcard";
import { getDailyTimestamps } from "@/utils/timestamp";

interface ProgressData {
  gameId: string;
  title: string;
  correctAnswers: number;
  wrongAnswers: number;
  totalSubmissions: number;
  target: number;
}

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [todayTarget, setTodayTaget] = useState<ProgressData[]>([]);

  const filteredGames =
    filter === "all" ? games : games.filter((game) => game.course === filter);

  const { status } = useSession();

  useEffect(() => {
    if (status == "authenticated") {
      const fetchData = async () => {
        try {
          const dailyTimestamp = getDailyTimestamps();

          const response = await axios.post("/api/stats", {
            startTime: dailyTimestamp.startTimestamp,
            endTime: dailyTimestamp.endTimestamp,
          });

          setTodayTaget(response.data);
        } catch (error) {
          console.error("Error fetching game data:", error);
        }
      };

      fetchData();
    }
  }, [status]);

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Raih&nbsp;</h1>
        <h1 className={title({ color: "yellow" })}>bintang✨&nbsp;</h1>
        <br />
        <h1 className={title()}>dengan belajar</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          dan dunia akan terbuka untukmu
        </h2>
      </div>

      {status === "authenticated" && (
        <TargetCard
          data={todayTarget}
          subtitle="ayo selesaikan target harian kamu!"
          title="🎯 Target Harian"
        />
      )}

      <div className="flex gap-x-2 pt-4 pb-2 items-center relative md:pad-x">
        <div className="no-scrollbar flex overflow-auto gap-x-2">
          {courses.map((course, index) => {
            return (
              <Chip
                key={index}
                className="cursor-pointer"
                color="warning"
                radius="md"
                startContent={course.icon}
                variant={course.id === filter ? "bordered" : "light"}
                onClick={() => setFilter(course.id)}
              >
                {course.title}
              </Chip>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 flex-wrap items-center justify-center">
        {filteredGames.map((game, index) => {
          return (
            <GameCard
              key={index}
              course={game.course}
              href={`/game/${game.id}`}
              id={game.id}
              thumbnail={game.thumbnail}
              title={game.title}
            />
          );
        })}
      </div>
    </section>
  );
}
