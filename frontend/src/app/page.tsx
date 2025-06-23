import { WeatherForm } from "@/components/weather-form";
import { WeatherLookup } from "@/components/weather-lookup";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Weather System
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit weather requests and retrieve stored results
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Weather Form Section */}
          <div className="flex flex-col items-center justify-start">
            <h2 className="text-2xl font-semibold mb-4">
              Submit Weather Request
            </h2>
            <WeatherForm />
          </div>

          {/* Data Lookup Section Placeholder */}
          <div className="flex flex-col items-center justify-start">
            <h2 className="text-2xl font-semibold mb-4">Lookup Weather Data</h2>
            <WeatherLookup />
            {/* <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              <div className="text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">
                  TODO: Implement Data Lookup
                </h3>
                <p className="text-sm">
                  This section should allow users to enter an ID and retrieve
                  stored weather data.
                </p>
                <p className="text-xs mt-2 text-muted-foreground/75">
                  Backend GET /weather/{"{id}"} endpoint is already implemented.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
