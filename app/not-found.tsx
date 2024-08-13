import Link from "next/link";
import { Button } from "@nextui-org/button";

export default function NotFound() {
  return (
    <div className="w-full flex flex-col min-h-full items-center justify-center pad-x">
      <h1 className="text-5xl">😔</h1>
      <h1 className="font-semibold text-xl md:text-3xl text-center">
        Oops! Halaman tidak ada
      </h1>
      <p className="text-center font-medium text-foreground/60 pt-2 pb-5">
        Halaman yang kamu cari tidak ada.
      </p>
      <Button as={Link} color="primary" href="/" variant="flat">
        Coba Lagi!
      </Button>
    </div>
  );
}
