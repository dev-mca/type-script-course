// Abschlussprojekt – Startpunkt der Oberfläche (ausbauen!)
//
// Zeigt, wie das Web die gemeinsamen Schemas aus shared/ verwendet:
// Die Antwort des Servers wird mit demselben ServiceSchema geprüft,
// mit dem der Server seine Daten beschreibt.

import { useEffect, useState } from "react";
import { z } from "zod";
import { type Service, ServiceSchema } from "../../shared/typen";

type Loadable<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

export function App() {
  const [services, setServices] = useState<Loadable<Service[]>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/services")
      .then((response) => response.json())
      .then((body: unknown) => z.array(ServiceSchema).parse(body))
      .then((data) => {
        if (!cancelled) setServices({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (!cancelled) setServices({ status: "error", message: String(error) });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <h1>✂️ Salon</h1>
      <p>Das ist der Startpunkt deines Abschlussprojekts. Los geht's mit Meilenstein M4!</p>
      {services.status === "loading" && <p>Lade Services …</p>}
      {services.status === "error" && <p className="error">{services.message}</p>}
      {services.status === "success" && (
        <ul>
          {services.data.map((service) => (
            <li key={service.id}>{service.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
