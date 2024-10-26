"use client";
import { useState, useEffect } from "react";
import MathQuizTemplate from "@/components/templates/math-quiz";
import { GameProvider } from "@/providers/game-provider";

const GamePembagian = () => {
  const [questionData, setQuestionData] = useState({
    question: "",
    correctAnswer: 0,
  });

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * (66 - 21 + 1)) + 21;
    const num2 = Math.floor(Math.random() * (9 - 3 + 1)) + 3;
    setQuestionData({
      question: `${num1 * num2} ÷ ${num2}`,
      correctAnswer: (num1 * num2) / num2,
    });
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswerSubmitted = () => {
    generateQuestion();
  };

  return (
    <GameProvider
      gameId="pembagian"
      colorTheme="yellow"
      onAnswerSubmitted={handleAnswerSubmitted}
    >
      <MathQuizTemplate
        question={questionData.question}
        correctAnswer={questionData.correctAnswer}
      />
    </GameProvider>
  );
};

export default GamePembagian;
