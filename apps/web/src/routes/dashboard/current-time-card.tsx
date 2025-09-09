import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export function CurrentTimeCard() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="bg-card p-4">
      <h3 className="mb-1 font-semibold text-foreground">Current Time</h3>
      <p className="text-muted-foreground text-xs">Local timezone</p>
      <p className="mt-2 font-mono text-2xl text-primary">
        {now.toLocaleTimeString()}
      </p>
      <p className="text-muted-foreground text-xs">
        {now.toLocaleDateString()}
      </p>
    </Card>
  );
}

