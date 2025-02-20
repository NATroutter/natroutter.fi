import * as React from "react";
import Home from "@/app/home";
import {getHomePage} from "@/lib/database";

export default async function HomePage() {

  const data = await getHomePage();

  return (
        <Home data={data}></Home>
  );
}
