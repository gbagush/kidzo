"use client";

import React from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar } from "@nextui-org/avatar";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Skeleton } from "@nextui-org/skeleton";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { ChartBar, LogOut } from "lucide-react";

import { ThemeSwitch } from "./theme-switch";

import Logo from "@/public/logo.png";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <NextUINavbar position="static">
      <Link href="/">
        <NavbarBrand>
          <Image alt="Logo" height={42} src={Logo} />
        </NavbarBrand>
      </Link>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          {status === "loading" ? (
            <Skeleton className="flex rounded-full w-10 h-10" />
          ) : status === "authenticated" && session?.user ? (
            <Dropdown>
              <DropdownTrigger>
                <Avatar src={session.user.image!} />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Options" variant="faded">
                <DropdownItem
                  key="stats"
                  href="/stats"
                  startContent={<ChartBar size={20} />}
                >
                  Statistik
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  startContent={<LogOut size={20} />}
                  onClick={() => signOut()}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              color="primary"
              href="#"
              variant="flat"
              onClick={() => signIn("google")}
            >
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};

export default Navbar;
