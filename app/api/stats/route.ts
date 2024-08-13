import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/config/nextauth";

import { db } from "@/lib/db";
import { games } from "@/config/course";
import { calculateDaysBetweenTimestamps } from "@/utils/timestamp";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const requestData = await request.json();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!requestData.startTime && !requestData.endTime) {
    return NextResponse.json(
      { message: "Invalid parameters" },
      { status: 400 }
    );
  }

  const submissionCounts = await db.submission.groupBy({
    by: ["gameId"],
    where: {
      userId: session.user.id,
      timestamp: {
        gte: new Date(requestData.startTime),
        lte: new Date(requestData.endTime),
      },
    },
    _count: {
      id: true,
    },
  });

  const correctAnswersCount = await db.submission.groupBy({
    by: ["gameId"],
    where: {
      userId: session.user.id,
      timestamp: {
        gte: new Date(requestData.startTime),
        lte: new Date(requestData.endTime),
      },
      isCorrect: true,
    },
    _count: {
      id: true,
    },
  });

  const result = games.map((game) => {
    const submissionData = submissionCounts.find(
      (submission) => submission.gameId === game.id
    );
    const correctData = correctAnswersCount.find(
      (correct) => correct.gameId === game.id
    );

    const totalSubmissions = submissionData ? submissionData._count.id : 0;
    const correctAnswers = correctData ? correctData._count.id : 0;
    const wrongAnswers = totalSubmissions - correctAnswers;

    return {
      gameId: game.id,
      title: game.title,
      totalSubmissions,
      correctAnswers,
      wrongAnswers,
      target:
        game.target *
        calculateDaysBetweenTimestamps(
          requestData.startTime,
          requestData.endTime
        ),
    };
  });

  return NextResponse.json(result, { status: 200 });
}
