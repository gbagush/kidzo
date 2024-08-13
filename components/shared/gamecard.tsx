import Image from "next/image";
import { Link } from "@nextui-org/link";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

const GameCard = ({ title, course, thumbnail, href }: any) => {
  return (
    <Link href={href}>
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <small className="text-default-500 uppercase">{course}</small>
          <h4 className="font-bold text-large">{title}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt={title}
            className="object-cover rounded-lg"
            height={200}
            src={thumbnail}
            width={200}
          />
        </CardBody>
      </Card>
    </Link>
  );
};

export default GameCard;
