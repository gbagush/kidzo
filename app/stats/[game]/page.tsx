"use client";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { DateRangePicker } from "@nextui-org/date-picker";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { ChevronDown } from "lucide-react";
import { Pagination } from "@nextui-org/pagination";
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/chip";
import { parseDate } from "@internationalized/date";

import { games } from "@/config/course";
import { formatDate, formatTimestamp } from "@/utils/timestamp";

interface ProgressData {
  id: number;
  userId: string;
  gameId: string;
  question: string;
  userAnswer: string;
  answer: string;
  isCorrect: boolean;
  timestamp: string;
  workingTime: number;
}

export default function GameStatsPage({
  params,
}: {
  params: { game: string };
}) {
  const { status } = useSession();
  const [dataPerPage, setDataPerPage] = useState(10);
  const [submissions, setSubmissions] = useState<ProgressData[]>([]);
  const [pagination, setPagination] = useState(1);
  const [filterDate, setFilterDate] = useState({
    start: parseDate(
      formatDate(new Date(new Date().setDate(new Date().getDate() - 7)))
    ),
    end: parseDate(formatDate(new Date())),
  });

  const gameData = useMemo(
    () => games.find((game) => game.id === params.game),
    [params.game]
  );

  useEffect(() => {
    if (status === "authenticated" && gameData) {
      const fetchData = async () => {
        try {
          const submissionResult = await axios.post(
            `/api/stats/${gameData.id}`,
            {
              startTime: filterDate.start.toString(),
              endTime: filterDate.end.toString(),
            }
          );

          setSubmissions(submissionResult.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [status, filterDate, gameData]);

  useEffect(() => {
    setPagination(1);
  }, [dataPerPage]);

  const paginatedSubmissions = useMemo(() => {
    const startIndex = (pagination - 1) * dataPerPage;
    const endIndex = startIndex + dataPerPage;

    return submissions.slice(startIndex, endIndex);
  }, [submissions, pagination, dataPerPage]);

  if (!gameData) {
    return notFound();
  }

  const columns = [
    { key: "timestamp", label: "Timestamp" },
    { key: "questions", label: "Pertanyaan" },
    { key: "user-answer", label: "Jawaban" },
    { key: "correct-answer", label: "Jawaban Benar" },
    { key: "is-correct", label: "Status" },
    { key: "time", label: "Waktu" },
  ];

  return (
    <section className="max-w-2xl mx-auto">
      <User
        avatarProps={{ src: `/thumbnails/${gameData.id}.png`, radius: "sm" }}
        className="mb-4"
        description={gameData.course}
        name={gameData.title}
      />
      <div className="flex justify-between gap-3 items-end mb-4">
        <DateRangePicker
          className="max-w-xs"
          defaultValue={filterDate}
          labelPlacement="outside-left"
          onChange={setFilterDate}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize"
              endContent={<ChevronDown size={20} />}
              variant="light"
            >
              {`${dataPerPage}`}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            variant="flat"
          >
            <DropdownItem onClick={() => setDataPerPage(5)}>5</DropdownItem>
            <DropdownItem onClick={() => setDataPerPage(10)}>10</DropdownItem>
            <DropdownItem onClick={() => setDataPerPage(15)}>15</DropdownItem>
            <DropdownItem onClick={() => setDataPerPage(25)}>25</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="flex justify-between gap-3 items-end">
        <Table
          aria-label="Example table with dynamic content"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                color="warning"
                page={pagination}
                total={Math.ceil(submissions.length / dataPerPage)}
                onChange={setPagination}
              />
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          {submissions.length < 1 ? (
            <TableBody emptyContent={"Tidak ada data."}>{[]}</TableBody>
          ) : (
            <TableBody items={paginatedSubmissions}>
              {paginatedSubmissions.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.key === "timestamp" &&
                        formatTimestamp(item.timestamp)}
                      {column.key === "questions" && item.question}
                      {column.key === "user-answer" && item.userAnswer}
                      {column.key === "correct-answer" && item.answer}
                      {column.key === "is-correct" && (
                        <Chip
                          color={item.isCorrect ? "primary" : "danger"}
                          size="sm"
                          variant="bordered"
                        >
                          {item.isCorrect ? "Benar" : "Salah"}
                        </Chip>
                      )}
                      {column.key === "time" && `${item.workingTime} detik`}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </section>
  );
}
