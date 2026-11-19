"use client";

import { useEffect, useState } from "react";

export default function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <p className="text-sm text-muted-foreground">
      © {year ?? "2026"} ShopEase
    </p>
  );
}