"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Chip } from "@nextui-org/chip";

import { title } from "@/components/primitives";
import TargetCard from "@/components/shared/targetcard";
import GameCard from "@/components/shared/gamecard";
import { courses, games } from "@/config/course";
import {
  getDailyTimestamps,
  getWeeklyTimestamps,
  getMonthlyTimestamps,
} from "@/utils/timestamp";

interface ProgressData {
  gameId: string;
  title: string;
  correctAnswers: number;
  wrongAnswers: number;
  totalSubmissions: number;
  target: number;
}

export default function StatsPage() {
  const { status } = useSession();
  const [filter, setFilter] = useState("all");
  const [dailyTarget, setDailyTarget] = useState<ProgressData[]>([]);
  const [weeklyTarget, setWeeklyTarget] = useState<ProgressData[]>([]);
  const [monthlyTarget, setMonthlyTarget] = useState<ProgressData[]>([]);

  if (status == "unauthenticated") {
    signIn("google");
  }

  const filteredGames =
    filter === "all" ? games : games.filter((game) => game.course === filter);

  useEffect(() => {
    if (status == "authenticated") {
      const fetchData = async () => {
        try {
          const dailyTimestamp = getDailyTimestamps();
          const weeklyTimestamp = getWeeklyTimestamps();
          const monthlyTimestamp = getMonthlyTimestamps();

          const dailyData = await axios.post("/api/stats", {
            startTime: dailyTimestamp.startTimestamp,
            endTime: dailyTimestamp.endTimestamp,
          });

          const weeklyData = await axios.post("/api/stats", {
            startTime: weeklyTimestamp.startTimestamp,
            endTime: weeklyTimestamp.endTimestamp,
          });

          const monthlyData = await axios.post("/api/stats", {
            startTime: monthlyTimestamp.startTimestamp,
            endTime: monthlyTimestamp.endTimestamp,
          });

          setDailyTarget(dailyData.data);
          setWeeklyTarget(weeklyData.data);
          setMonthlyTarget(monthlyData.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [status]);

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title({ color: "yellow" })}>Statistik</h1>
      </div>

      <div className="flex gap-4 flex-wrap items-center justify-center">
        <TargetCard
          data={dailyTarget}
          subtitle="ayo selesaikan target harian kamu!"
          title="🌤️ Target Harian"
        />
        <TargetCard
          data={weeklyTarget}
          subtitle="ayo selesaikan target mingguan kamu!"
          title="📆 Target Mingguan"
        />
        <TargetCard
          data={monthlyTarget}
          subtitle="ayo selesaikan target bulanan kamu!"
          title="🌙 Target Bulanan"
        />
      </div>

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
              href={`/stats/${game.id}`}
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
