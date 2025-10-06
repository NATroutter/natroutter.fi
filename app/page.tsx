import * as React from "react";
import Home from "@/app/Home";
import {getHomePage} from "@/lib/database";
import ContentError from "@/components/errors/ContentError";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const data = await getHomePage();
  if (!data) return (<ContentError/>);

  return (
        <Home data={data}></Home>
  );
}
