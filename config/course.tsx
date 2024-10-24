import { Calculator, Menu } from "lucide-react";

import PerkalianThumb from "@/public/thumbnails/perkalian.png";
import PembagianThumb from "@/public/thumbnails/pembagian.png";
import JamAnalog from "@/public/thumbnails/jam-analog.png";

const courses = [
  {
    id: "all",
    title: "Semua",
    icon: <Menu size={18} />,
  },
  {
    id: "matematika",
    title: "Matematika",
    icon: <Calculator size={18} />,
  },
];

const games = [
  {
    id: "perkalian",
    title: "Perkalian",
    course: "matematika",
    thumbnail: PerkalianThumb,
    target: 25,
  },
  {
    id: "pembagian",
    title: "Pembagian",
    course: "matematika",
    thumbnail: PembagianThumb,
    target: 10,
  },
  {
    id: "jam-analog",
    title: "Jam Analog",
    course: "matematika",
    thumbnail: JamAnalog,
    target: 25,
  },
];

export { courses, games };
