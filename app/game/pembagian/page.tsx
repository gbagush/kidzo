"use client";
import { useState, useEffect } from "react";
import axios from "axios";
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

const GamePembagian = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  const [answer, setAnswer] = useState("");
  const [gameStatus, setGameStatus] = useState<StatusType>("default");
  const [message, setMessage] = useState("");

  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const theme = localStorage.getItem("theme") || "light";

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("google");
    },
  });

  const generateRandomNumbers = () => {
    setNum1(Math.floor(Math.random() * (66 - 21 + 1)) + 21);
    setNum2(Math.floor(Math.random() * (9 - 3 + 1)) + 3);
    setAnswer("");
  };

  const handleSubmit = async () => {
    setIsTimerRunning(false);

    if (parseInt(answer) === (num1 * num2) / num2) {
      correctAllert(theme);
      setGameStatus("success");
    } else {
      wrongAllert(theme);
      setGameStatus("danger");
      setMessage(`Jawaban benar adalah ${(num1 * num2) / num2}`);
    }

    axios
      .post(`/api/game/pembagian`, {
        question: `${num1 * num2} ÷ ${num2}`,
        userAnswer: answer,
        answer: `${(num1 * num2) / num2}`,
        isCorrect: parseInt(answer) === (num1 * num2) / num2,
        workingTime: timer,
      })
      .catch((error) => {
        errorAllert("Gagal mengirim jawaban", theme);
      });

    setTimeout(() => {
      setGameStatus("default");
      setAnswer("");
      setMessage("");
      generateRandomNumbers();
      setTimer(0);
      setIsTimerRunning(true);
    }, 3000);
  };

  useEffect(() => {
    generateRandomNumbers();
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTimerRunning]);

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
            avatarProps={{ src: `/thumbnails/pembagian.png`, radius: "sm" }}
            description="matematika"
            name="Pembagian"
          />
        </div>
        <div className="flex justify-end">
          <Chip
            color="warning"
            radius="md"
            startContent={<Clock size={18} />}
            variant="bordered"
          >
            {timer}
          </Chip>
        </div>
      </div>
      <div className="inline-block max-w-lg text-center justify-center mt-8">
        <h1 className={title({ color: "yellow" })}>
          {num1 && num2 ? `${num1 * num2} ÷ ${num2} = ?` : <Skeleton />}
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

export default GamePembagian;
