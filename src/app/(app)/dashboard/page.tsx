"use client";

import Link from "next/link";
import TodoList from "@/components/todo/TodoList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <Card className="p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Sprout</div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <Button asChild variant="secondary">
          <Link href="/connect">Propojení</Link>
        </Button>
      </Card>

      <TodoList />
    </div>
  );
}
