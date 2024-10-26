import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "next-themes";
import { signIn, useSession } from "next-auth/react";
import { Chip } from "@nextui-org/chip";
import { User } from "@nextui-org/user";
import { Clock } from "lucide-react";
import { correctAllert, wrongAllert, errorAllert } from "@/utils/alerts";

// Define specific types for color variants
type ChipColorVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
type QuestionColorVariant =
  | "violet"
  | "yellow"
  | "blue"
  | "green"
  | "pink"
  | "foreground";
type GameStatus = "default" | "success" | "danger";

type ColorThemeConfig = {
  [key: string]: {
    question: QuestionColorVariant;
    chip: ChipColorVariant;
  };
};

const colorThemeConfig: ColorThemeConfig = {
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

type GameContextType = {
  gameId: string;
  answer: string;
  setAnswer: (answer: string) => void;
  gameStatus: GameStatus;
  message: string;
  elapsedTime: number;
  isTimerRunning: boolean;
  handleSubmit: (correctAnswer: string, question: string) => Promise<void>; // Updated
  handleButtonClick: (value: string) => void;
  handleDelete: () => void;
  colorConfig: {
    question: QuestionColorVariant;
    chip: ChipColorVariant;
  };
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

type GameProviderProps = {
  children: React.ReactNode;
  gameId: string;
  colorTheme: keyof typeof colorThemeConfig;
  onAnswerSubmitted: () => void;
};

export const GameProvider = ({
  children,
  gameId,
  colorTheme,
  onAnswerSubmitted,
}: GameProviderProps) => {
  const [answer, setAnswer] = useState("");
  const [gameStatus, setGameStatus] = useState<GameStatus>("default");
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const { theme } = useTheme();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("google");
    },
  });

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, startTime]);

  const handleSubmit = async (correctAnswer: string, userAnswer: string) => {
    setIsTimerRunning(false);
    console.log("Comparing answers:", correctAnswer === userAnswer); // Check if answers match
    console.log("Correct Answer:", correctAnswer);
    console.log("User Answer:", userAnswer);

    if (correctAnswer === userAnswer) {
      correctAllert(theme || "light");
      setGameStatus("success");
      setMessage("Jawaban benar!"); // Optional feedback for correct answer
    } else {
      wrongAllert(theme || "light");
      setGameStatus("danger");
      setMessage(`Jawaban benar adalah ${correctAnswer}`);
    }

    try {
      await axios.post(`/api/game/${gameId}`, {
        question: userAnswer, // Updated: Send user answer as well
        userAnswer: userAnswer,
        answer: correctAnswer,
        isCorrect: correctAnswer === userAnswer,
        workingTime: elapsedTime,
      });
    } catch (error) {
      errorAllert("Gagal mengirim jawaban", theme || "light");
      console.error("Error submitting answer:", error);
    }

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

  const handleButtonClick = (value: string) => {
    setAnswer((prev) => prev + value);
  };

  const handleDelete = () => {
    setAnswer((prev) => prev.slice(0, -1));
  };

  const value = {
    gameId,
    answer,
    setAnswer,
    gameStatus,
    message,
    elapsedTime,
    isTimerRunning,
    handleSubmit,
    handleButtonClick,
    handleDelete,
    colorConfig: colorThemeConfig[colorTheme],
  };

  return (
    <GameContext.Provider value={value}>
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
              color={colorThemeConfig[colorTheme].chip}
              radius="md"
              startContent={<Clock size={18} />}
              variant="bordered"
            >
              {elapsedTime}
            </Chip>
          </div>
        </div>
        {children}
      </section>
    </GameContext.Provider>
  );
};
