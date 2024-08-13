import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/config/nextauth";

import { games } from "@/config/course";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { game: string } }
) {
  const session = await getServerSession(authOptions);
  const gameId = params.game;
  const requestData = await request.json();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!games.some((game) => game.id === gameId)) {
    return NextResponse.json({ mesage: "Game not found" }, { status: 404 });
  }

  if (!requestData.startTime && !requestData.endTime) {
    return NextResponse.json(
      { message: "Invalid parameters" },
      { status: 400 }
    );
  }

  const endDate = new Date(requestData.endTime);

  endDate.setHours(23, 59, 59, 999);

  const result = await db.submission.findMany({
    where: {
      userId: session.user.id,
      timestamp: {
        gte: new Date(requestData.startTime),
        lte: endDate,
      },
      gameId: gameId,
    },
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(result, { status: 200 });
}
