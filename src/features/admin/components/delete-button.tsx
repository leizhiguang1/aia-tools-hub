"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DeleteButton({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<void>;
}) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("确定要删除吗？")) return;
    setPending(true);
    await action(id);
    setPending(false);
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={pending}
    >
      {pending ? "删除中..." : "删除"}
    </Button>
  );
}
