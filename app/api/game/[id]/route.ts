import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/config/nextauth";

import { games } from "@/config/course";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const gameId = params.id;
  const requestData = await request.json();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!games.some((game) => game.id === gameId)) {
    return NextResponse.json({ mesage: "Game not found" }, { status: 404 });
  }

  if (
    !requestData.question &&
    !requestData.userAnswer &&
    !requestData.answer &&
    !requestData.isCorrect &&
    !requestData.workingTime
  ) {
    return NextResponse.json(
      { message: "Invalid parameters" },
      { status: 400 }
    );
  }

  const submission = await db.submission.create({
    data: {
      userId: session.user.id,
      gameId: gameId,
      question: requestData.question,
      userAnswer: requestData.userAnswer,
      answer: requestData.answer,
      isCorrect: requestData.isCorrect,
      workingTime: requestData.workingTime,
    },
  });

  return NextResponse.json({ submission, mesage: "ok" }, { status: 200 });
}
