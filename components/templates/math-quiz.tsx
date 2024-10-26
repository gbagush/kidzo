import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { title } from "@/components/primitives";
import { useGame } from "@/providers/game-provider";

type MathQuizTemplateProps = {
  question: string;
  correctAnswer: number;
};

const MathQuizTemplate = ({
  question,
  correctAnswer,
}: MathQuizTemplateProps) => {
  const {
    answer,
    setAnswer,
    gameStatus,
    message,
    handleSubmit,
    handleButtonClick,
    handleDelete,
    colorConfig,
  } = useGame();

  return (
    <>
      <div className="inline-block max-w-lg text-center justify-center mt-8">
        <h1 className={title({ color: colorConfig.question })}>{question}</h1>
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
          isDisabled={!answer || gameStatus !== "default"}
          size="lg"
          onClick={() => handleSubmit(String(correctAnswer), question)}
        >
          Jawab
        </Button>
      </div>
      <div className="inline-block max-w-lg text-center justify-center mt-8">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((num) => (
          <Button key={num} onClick={() => handleButtonClick(num)}>
            {num}
          </Button>
        ))}
        <Button onClick={handleDelete}>Del</Button>
      </div>
    </>
  );
};

export default MathQuizTemplate;
