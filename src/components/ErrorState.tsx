import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card role="alert">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <p className="text-sm">{message}</p>
        <Button variant="outline" onClick={onRetry} aria-label="Försök igen">
          Försök igen
        </Button>
      </CardContent>
    </Card>
  );
}
