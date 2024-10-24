"use client";
import axios from "axios";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { signIn, useSession } from "next-auth/react";

import { Skeleton } from "@nextui-org/skeleton";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Clock } from "lucide-react";
import { User } from "@nextui-org/user";

import { title } from "@/components/primitives";
import { correctAllert, wrongAllert, errorAllert } from "@/utils/alerts";

type StatusType = "default" | "success" | "danger";

type ThemeConfig = {
  [key: string]: {
    question:
      | "violet"
      | "yellow"
      | "blue"
      | "cyan"
      | "green"
      | "pink"
      | "foreground"
      | undefined;
    chip:
      | "default"
      | "success"
      | "danger"
      | "primary"
      | "secondary"
      | "warning"
      | undefined;
  };
};

const themeConfig: ThemeConfig = {
  violet: {
    question: "violet",
    chip: "secondary",
  },
  yellow: {
    question: "yellow",
    chip: "warning",
  },
  blue: {
    question: "blue",
    chip: "primary",
  },
  green: {
    question: "green",
    chip: "success",
  },
  pink: {
    question: "pink",
    chip: "danger",
  },
};

const MathQuizTemplate = ({
  gameId,
  question,
  correctAnswer,
  colorTheme,
  onAnswerSubmitted,
}: any) => {
  const [answer, setAnswer] = useState("");
  const [gameStatus, setGameStatus] = useState<StatusType>("default");
  const [message, setMessage] = useState("");

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const { theme, setTheme } = useTheme();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("google");
    },
  });

  const selectedColorTheme = themeConfig[colorTheme];

  const handleSubmit = async () => {
    setIsTimerRunning(false);

    if (parseInt(answer) === correctAnswer) {
      correctAllert(theme || "light");
      setGameStatus("success");
    } else {
      wrongAllert(theme || "light");
      setGameStatus("danger");
      setMessage(`Jawaban benar adalah ${correctAnswer}`);
    }

    const totalElapsedTime = Math.floor((Date.now() - (startTime || 0)) / 1000);

    axios
      .post(`/api/game/${gameId}`, {
        question: question,
        userAnswer: answer,
        answer: correctAnswer.toString(),
        isCorrect: parseInt(answer) === correctAnswer,
        workingTime: totalElapsedTime,
      })
      .catch((error) => {
        errorAllert("Gagal mengirim jawaban", theme || "light");
      });

    setTimeout(() => {
      setGameStatus("default");
      setAnswer("");
      setMessage("");
      setStartTime(Date.now());
      setElapsedTime(0);
      setIsTimerRunning(true);
      onAnswerSubmitted();
    }, 3000);
  };

  useEffect(() => {
    setStartTime(Date.now());
  }, [question]);

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - (startTime || now)) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTimerRunning, startTime]);

  const handleButtonClick = (value: string) => {
    setAnswer((prevAnswer) => prevAnswer + value);
  };

  const handleDelete = () => {
    setAnswer((prevAnswer) => prevAnswer.slice(0, -1));
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 -mt-4">
      <div className="w-full max-w-lg flex justify-between items-center">
        <div className="flex justify-start">
          <User
            avatarProps={{ src: `/thumbnails/${gameId}.png`, radius: "sm" }}
            description="matematika"
            name={gameId.charAt(0).toUpperCase() + gameId.slice(1)}
          />
        </div>
        <div className="flex justify-end">
          <Chip
            color={themeConfig[colorTheme].chip || "default"}
            radius="md"
            startContent={<Clock size={18} />}
            variant="bordered"
          >
            {elapsedTime}
          </Chip>
        </div>
      </div>
      <div className="inline-block max-w-lg text-center justify-center mt-8">
        <h1
          className={title({
            color: themeConfig[colorTheme].question || "foreground",
          })}
        >
          {question || <Skeleton />}
        </h1>
      </div>
      <div className="inline-block max-w-lg text-center justify-center mt-8">
        <Input
          color={gameStatus}
          description={message}
          size="lg"
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>
      <div className="inline-block max-w-lg text-center justify-center mt-4">
        <Button
          color="default"
          isDisabled={!answer || gameStatus != "default"}
          size="lg"
          onClick={handleSubmit}
        >
          Jawab
        </Button>
      </div>
      <div className="inline-block max-w-lg text-center justify-center mt-8">
        <Button onClick={() => handleButtonClick("1")}>1</Button>
        <Button onClick={() => handleButtonClick("2")}>2</Button>
        <Button onClick={() => handleButtonClick("3")}>3</Button>
        <Button onClick={() => handleButtonClick("4")}>4</Button>
        <Button onClick={() => handleButtonClick("5")}>5</Button>
        <Button onClick={() => handleButtonClick("6")}>6</Button>
        <Button onClick={() => handleButtonClick("7")}>7</Button>
        <Button onClick={() => handleButtonClick("8")}>8</Button>
        <Button onClick={() => handleButtonClick("9")}>9</Button>
        <Button onClick={() => handleButtonClick("0")}>0</Button>
        <Button onClick={handleDelete}>Del</Button>
      </div>
    </section>
  );
};

export default MathQuizTemplate;
