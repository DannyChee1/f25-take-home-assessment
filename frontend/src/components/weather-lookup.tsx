"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";

interface WeatherBundle {
    id: string;
    date: string;
    location: string;
    notes: string;
    weather: Record<string, any>;
}

export function WeatherLookup() {
    const [lookupId, setLookupId] = useState("");
    const [isSearching, setSearching] = useState(false);
    const [result, setResult] = useState<{
        success: true;
        data: WeatherBundle;
    } | {
        success: false;
        message: string;
    } | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>) => {
            setLookupId(e.target.value);
    };

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!lookupId) return;
        setSearching(true);
        setResult(null);
        try {
            const response = await fetch(`http://localhost:8000/weather/${lookupId}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });
            if (response.ok) {
                const data: WeatherBundle = await response.json();
                setResult({
                    success: true, 
                    data 
                });
            }
            else {
                const error = await response.json().catch(() => ({}));
                setResult({
                    success: false,
                    message: error.detail || "Error ${response.status}: ID could not be found",
                });
            }
        } catch (networkError) {
            setResult({
                    success: false,
                    message: "Network error: could not reach the server",
            });
        } finally {
            setSearching(false);
        }
     };
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Weather Data Lookup</CardTitle>
                <CardDescription>
                    Submit an ID and retrieve stored weather data
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLookup} className="space-y-4">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="id" className="px-1">
                            ID
                        </Label>
                        <Input
                            id="id"
                            name="id"
                            type="text"
                            placeholder="Please enter your UUID"
                            value={lookupId}
                            onChange={handleInputChange}
                            required 
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSearching}>
                        {isSearching ? "Looking Up..." : "Lookup ID"}
                    </Button>

                    {result && result.success && result.data && (
                        <div
                        className={"p-3 rounded-md bg-green-900/20 text-green-500 border border-green-500"}>
                        <p className="text-xs mt-1">
                            Date: {result.data.date}
                        </p>
                        <p className="text-xs mt-1">
                            Location: {result.data.location}
                        </p>
                        <p className="text-xs mt-1">
                            Notes: {result.data.notes}
                        </p>
                        <p className="whitespace-pre-wrap break-words text-xs mt-1">
                            Weather:{" "}
                            <code>{JSON.stringify(result.data.weather, null, 2)}</code>
                        </p>
                        </div>
                    )}

                    
                    {result && !result.success && (
                        <div 
                        className={"p-3 rounded-md bg-red-900/20 text-red-500 border border-red-500"}>
                            <p>{result.message}</p>
                        </div>  
                    )} 
                </form>
            </CardContent>
        </Card>
    );
}