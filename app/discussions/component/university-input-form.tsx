"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from "next/navigation";
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@headlessui/react";
import { instituteDetails } from "@/lib/institute.data";
import { hackerMedium } from "@/fonts/font";

interface UniversityInputFormProps {
    username: string;
    firstName: string;
}

export function UniversityInputForm({ username, firstName }: UniversityInputFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const methods = useForm({
        defaultValues: {
            university: ""
        }
    });

    const handleUniversitySubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError("");

            const response = await fetch("/api/user/update-university", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, university: data.university }),
            });

            if (response.ok) {
                router.refresh(); // Refresh the page to show discussions
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to update university");
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError("Failed to update university");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8 bg-background">
            <CardHeader>
                <CardTitle className="text-xl" style={hackerMedium.style}>Your Campus</CardTitle>
                <CardDescription className="flex items-center gap-2 text-base">
                    {`Hey ${firstName}, to show discussions from your campus, we need to know which university you're from. Fill in the details below!`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider {...methods}>
                    <div className="space-y-4">
                        <div>
                            <FormField
                                control={methods.control}
                                name="university"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col text-sm mt-2">
                                        <FormLabel>University</FormLabel>
                                        <Combobox
                                            value={field.value}
                                            onChange={(value: string) => field.onChange(value)}
                                        >
                                            <div className="relative mt-1">
                                                <div className="relative h-9 bg-foreground w-full cursor-default overflow-hidden rounded-md text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-700 sm:text-sm">
                                                    <div className="bg-background border border-input rounded-md">
                                                        <Combobox.Input
                                                            className="w-full text-text_primary bg-background border-none py-[0.450rem] pl-3 pr-10 text-sm leading-5 focus:ring-0 rounded-md"
                                                            onChange={(event) => field.onChange(event.target.value)}
                                                            displayValue={(university: string) => university}
                                                        />
                                                    </div>
                                                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronsUpDown
                                                            className="h-4 w-4 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                    </Combobox.Button>
                                                </div>

                                                <Combobox.Options className="text-text_primary absolute mt-1 max-h-60 w-full overflow-auto bg-background py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {instituteDetails
                                                        .filter((institute) =>
                                                            field.value
                                                                ? institute.name
                                                                    .toLowerCase()
                                                                    .includes(field.value.toLowerCase())
                                                                : true
                                                        )
                                                        .map((institute) => (
                                                            <Combobox.Option
                                                                key={institute._id}
                                                                className={({ active }) =>
                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary text-text_primary' : 'text-text_primary'}`
                                                                }
                                                                value={institute.name}
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span
                                                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                                                        >
                                                                            {institute.name}
                                                                        </span>
                                                                        {selected ? (
                                                                            <span
                                                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-text_primary' : 'text-primary'}`}
                                                                            >
                                                                                <Check className="h-5 w-5" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Combobox.Option>
                                                        ))}
                                                </Combobox.Options>
                                            </div>
                                        </Combobox>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={methods.handleSubmit(handleUniversitySubmit)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save University"}
                        </Button>
                    </div>
                </FormProvider>
            </CardContent>
        </Card>
    );
}