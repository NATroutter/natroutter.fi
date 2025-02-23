import * as React from "react";
import Home from "@/app/home";
import {getHomePage} from "@/lib/database";
import ContentError from "@/components/errors/ContentError";

export default async function HomePage() {
  const data = await getHomePage();
  if (!data) return (<ContentError/>);

  return (
        <Home data={data}></Home>
  );
}
