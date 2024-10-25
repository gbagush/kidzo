"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { signIn, useSession } from "next-auth/react";

import { Chip } from "@nextui-org/chip";
import { Clock } from "lucide-react";
import AnalogClock from "@/components/shared/clock/clock";
import { User } from "@nextui-org/user";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import { correctAllert, wrongAllert, errorAllert } from "@/utils/alerts";

type StatusType = "default" | "success" | "danger";

export default function JamAnalogGame() {
  const [gameStatus, setGameStatus] = useState<StatusType>("default");
  const [message, setMessage] = useState("");

  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const [randomHour, setRandomHour] = useState<number>(0);
  const [randomMinute, setRandomMinute] = useState<number>(0);

  const [userHour, setUserHour] = useState<string>("");
  const [userMinute, setUserMinute] = useState<string>("");

  const { theme, setTheme } = useTheme();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("google");
    },
  });

  const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
  };

  const generateRandomTime = async () => {
    setRandomHour(Math.floor(Math.random() * 12) + 1);
    setRandomMinute(Math.floor(Math.random() * 12) * 5);
  };

  useEffect(() => {
    setStartTime(Date.now());
    generateRandomTime();
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTimerRunning, startTime]);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserHour(e.target.value);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMinute(e.target.value);
  };

  const handleSubmit = async () => {
    setIsTimerRunning(false);

    const formattedRandomHour = String(randomHour).padStart(2, "0");
    const formattedRandomMinute = String(randomMinute).padStart(2, "0");

    const correctAnswer = `${formattedRandomHour}:${formattedRandomMinute}`;

    const formattedUserHour = String(userHour).padStart(2, "0");
    const formattedUserMinute = String(userMinute).padStart(2, "0");

    const userAnswer = `${formattedUserHour}:${formattedUserMinute}`;

    if (userAnswer === correctAnswer) {
      correctAllert(theme || "light");
      setGameStatus("success");
    } else {
      wrongAllert(theme || "light");
      setGameStatus("danger");
      setMessage(
        `Jawaban yang benar adalah ${formattedRandomHour}:${formattedRandomMinute}`
      );
    }

    axios
      .post(`/api/game/jam-analog`, {
        question: correctAnswer,
        userAnswer: userAnswer,
        answer: correctAnswer,
        isCorrect: userAnswer === correctAnswer,
        workingTime: Math.floor((Date.now() - (startTime || 0)) / 1000),
      })
      .catch((error) => {
        errorAllert("Gagal mengirim jawaban", theme || "light");
      });

    await delay(3000);

    setGameStatus("default");
    setUserHour("");
    setUserMinute("");
    setMessage("");
    setElapsedTime(0);
    setStartTime(Date.now());
    setIsTimerRunning(true);
    generateRandomTime();
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 -mt-4">
      <div className="w-full max-w-lg flex justify-between items-center">
        <div className="flex justify-start">
          <User
            avatarProps={{ src: `/thumbnails/jam-analog.png`, radius: "sm" }}
            description="matematika"
            name="Jam Analog"
          />
        </div>
        <div className="flex justify-end">
          <Chip
            color="success"
            radius="md"
            startContent={<Clock size={18} />}
            variant="bordered"
          >
            {elapsedTime}
          </Chip>
        </div>
      </div>
      <div className="inline-block max-w-lg text-center justify-center mt-8">
        <AnalogClock
          hourRatio={(randomHour % 12) / 12 + randomMinute / 60 / 12}
          minuteRatio={randomMinute / 60}
          secondRatio={0}
        />
      </div>
      <div className="inline-block max-w-lg text-center justify-center mt-8">
        <div className="flex items-center justify-center gap-4">
          <Input
            size="lg"
            type="number"
            color={gameStatus}
            label="Jam"
            className="w-32"
            value={userHour}
            onChange={handleHourChange}
          />
          <h1 className="text-2xl font-bold">:</h1>
          <Input
            size="lg"
            type="number"
            color={gameStatus}
            label="Menit"
            className="w-32"
            value={userMinute}
            onChange={handleMinuteChange}
          />
        </div>
        <div className="mt-2">
          <span>{message}</span>
        </div>
      </div>
      <div className="inline-block max-w-lg text-center justify-center mt-4">
        <Button
          color="default"
          size="lg"
          onClick={handleSubmit}
          isDisabled={!userHour || !userMinute || gameStatus != "default"}
        >
          Jawab
        </Button>
      </div>
    </section>
  );
}
