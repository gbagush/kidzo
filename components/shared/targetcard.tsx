"use client";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { CircularProgress } from "@nextui-org/progress";
import { Divider } from "@nextui-org/divider";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

interface ProgressData {
  gameId: string;
  title: string;
  correctAnswers: number;
  wrongAnswers: number;
  totalSubmissions: number;
  target: number;
}

interface TargetCardProps {
  title: string;
  subtitle: string;
  data: ProgressData[];
}
const TargetCard = ({ title, subtitle, data }: TargetCardProps) => {
  return (
    <Card className="p-2">
      <CardHeader>
        <div className="flex flex-col">
          <p className="text-md font-semibold">{title}</p>
          <p className="text-small text-default-500">{subtitle}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          {data.length === 0 ? (
            <CircularProgress
              aria-label="Loading..."
              className="m-4"
              color="default"
            />
          ) : (
            data.map((game: ProgressData) => (
              <div key={game.gameId}>
                <h3 className="text-warning font-semibold mb-2">
                  {game.title}
                </h3>
                <Table removeWrapper aria-label="Game Stats">
                  <TableHeader>
                    <TableColumn>Benar</TableColumn>
                    <TableColumn>Salah</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="1">
                      <TableCell>{game.correctAnswers}</TableCell>
                      <TableCell>{game.wrongAnswers}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Table removeWrapper aria-label="Game Stats">
                  <TableHeader>
                    <TableColumn>Total</TableColumn>
                    <TableColumn>Target</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="2">
                      <TableCell>{game.totalSubmissions}</TableCell>
                      <TableCell>{game.target}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default TargetCard;
