"use client";
import { useState, useEffect } from "react";
import MathQuizTemplate from "@/components/templates/math-quiz";

const GamePerkalian = () => {
  const [questionData, setQuestionData] = useState({
    question: "",
    correctAnswer: 0,
  });
  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setQuestionData({
      question: `${num1} × ${num2}`,
      correctAnswer: num1 * num2,
    });
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswerSubmitted = () => {
    generateQuestion();
  };

  return (
    <div>
      <MathQuizTemplate
        gameId="perkalian"
        question={questionData.question}
        correctAnswer={questionData.correctAnswer}
        colorTheme="pink"
        onAnswerSubmitted={handleAnswerSubmitted}
      />
    </div>
  );
};

export default GamePerkalian;
