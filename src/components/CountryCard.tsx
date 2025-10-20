// file: src/components/CountryCard.tsx
import Link from "next/link";
import * as React from "react";

import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";

export type CountryCardProps = {
  code: string;
  name: string;
  region?: string;
  capital?: string;
  flagUrl?: string;
};

const CountryCardBase: React.FC<CountryCardProps> = ({ code, name, region, capital, flagUrl }) => {
  return (
    <li>
      <Link href={`/country/${code}`} className="block focus-visible:ring-0">
        <Card className="h-full overflow-hidden transition hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-indigo-400/40">
          <CardHeader className="flex items-center justify-center">
            {flagUrl ? (
              <img
                src={flagUrl}
                alt={`Flag of ${name}`}
                className="h-24 w-auto rounded-md border"
                loading="lazy"
              />
            ) : (
              <div className="h-24 w-full rounded-md bg-gray-100" />
            )}
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-lg mb-1 text-gray-900">{name}</h3>
            <div className="flex items-center gap-2 text-sm">
              {region ? <Badge className="border-gray-300">{region}</Badge> : null}
              {capital ? <span className="text-gray-600">Huvudstad: {capital}</span> : null}
            </div>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
};

const CountryCard = React.memo(CountryCardBase);
CountryCard.displayName = "CountryCard";
export default CountryCard;
