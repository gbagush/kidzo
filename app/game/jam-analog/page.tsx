"use client";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { GameProvider, useGame } from "@/providers/game-provider";
import AnalogClock from "@/components/shared/clock/clock";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

interface GameRef {
  generateQuestion: () => void;
}

const JamAnalogGame = forwardRef<GameRef>((props, ref) => {
  const [questionData, setQuestionData] = useState({
    hour: 0,
    minute: 0,
  });

  const { gameStatus, message, handleSubmit } = useGame();
  const [userHour, setUserHour] = useState("");
  const [userMinute, setUserMinute] = useState("");

  const generateQuestion = () => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = Math.floor(Math.random() * 12) * 5;
    setQuestionData({ hour, minute });
  };

  const getCorrectAnswer = () => {
    const formattedHour = String(questionData.hour).padStart(2, "0");
    const formattedMinute = String(questionData.minute).padStart(2, "0");
    return `${formattedHour}:${formattedMinute}`;
  };

  const handleSubmitAnswer = () => {
    const formattedUserHour = String(userHour).padStart(2, "0");
    const formattedUserMinute = String(userMinute).padStart(2, "0");
    const userAnswer = `${formattedUserHour}:${formattedUserMinute}`;

    handleSubmit(getCorrectAnswer(), userAnswer);

    setUserHour("");
    setUserMinute("");
  };

  useImperativeHandle(ref, () => ({
    generateQuestion,
  }));

  useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <div className="text-center mt-8">
      <AnalogClock
        hourRatio={
          (questionData.hour % 12) / 12 + questionData.minute / 60 / 12
        }
        minuteRatio={questionData.minute / 60}
        secondRatio={0}
      />
      <div className="flex items-center justify-center gap-4 mt-8">
        <Input
          size="lg"
          type="number"
          color={gameStatus}
          label="Jam"
          className="w-32"
          value={userHour}
          onChange={(e) => setUserHour(e.target.value)}
        />
        <h1 className="text-2xl font-bold">:</h1>
        <Input
          size="lg"
          type="number"
          color={gameStatus}
          label="Menit"
          className="w-32"
          value={userMinute}
          onChange={(e) => setUserMinute(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <span>{message}</span>
      </div>
      <Button
        color="default"
        size="lg"
        onClick={handleSubmitAnswer}
        isDisabled={!userHour || !userMinute || gameStatus !== "default"}
        className="mt-4"
      >
        Jawab
      </Button>
    </div>
  );
});

JamAnalogGame.displayName = "JamAnalogGame";

const WrappedJamAnalogGame = () => {
  const gameRef = useRef<GameRef>(null);

  return (
    <GameProvider
      gameId="jam-analog"
      colorTheme="green"
      onAnswerSubmitted={() => {
        if (gameRef.current) {
          gameRef.current.generateQuestion();
        }
      }}
    >
      <JamAnalogGame ref={gameRef} />
    </GameProvider>
  );
};

WrappedJamAnalogGame.displayName = "WrappedJamAnalogGame";

export default WrappedJamAnalogGame;
