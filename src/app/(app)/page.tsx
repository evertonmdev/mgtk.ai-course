import FormCard from "@/components/ui/FormCard";
import TableCourses from "@/components/ui/Table";

import React from "react";

export default function Home() {
  return (
    <main className="w-full min-h-dvh bg-background p-10 flex gap-3 max-lg:flex-col">
      <FormCard />
      <TableCourses />

    </main>
  );
}