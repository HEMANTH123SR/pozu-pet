"use client";
import React, { useState } from "react";
import Link from "next/link";
import { hackerMedium } from "@/fonts/font";
import { useForm, FormProvider } from "react-hook-form";
import { X, Loader2, ArrowLeft, Check, ChevronsUpDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SocialLinkComponent } from "@/app/edit-profile/component/sociale-links";
import { Combobox } from "@headlessui/react";
import { instituteDetails } from "@/lib/institute.data";
// import { Institute } from "@/lib/institute.data"; // Added import for Institute type

export const EditProfileForm = ({ user, userId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState(user?.socialLinks || []);
  const [skills, setSkills] = useState(user?.skills || []);
  const [interests, setInterests] = useState(user?.interests || []);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  // Split the full name into first and last name for default values
  const [firstName, lastName] = (user?.fullName || "").split(" ");

  const methods = useForm({
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      bio: user?.bio || "",
      location: user?.location || "",
      university: user?.university || "",
      profileImage: user?.profileImage || "",
    },
  });

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest("");
    }
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);

    try {
      // Combine first and last name into full name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...formData,
          fullName,
          skills,
          interests,
          socialLinks,
        }),
      });


      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods} >
      <div className="w-full flex flex-col h-screen overflow-y-scroll scroll-hidden border-r bg-darkBackground pb-14">
        <div
          className="w-full flex justify-between items-center px-6 border-b min-h-14"
          style={hackerMedium.style}
        >
          <div className="flex space-x-3 w-full justify-between items-center">
            <div className="flex justify-center items-center space-x-3">
              <Link
                href={`/${user?.username}`}
                className="p-1.5 border rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 hover:shadow-md hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <span>Edit Profile</span>
            </div>

            <Button
              type="submit"
              onClick={methods.handleSubmit(onSubmit)}
              // className=" text-white bg-primary"
              className="p-1.5 px-5 border flex justify-center items-center space-x-2 rounded-xl transition-transform duration-200  active:scale-95 hover:shadow-md hover:scale-110   bg-primary text-white "
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
        <Card className="w-full max-w-4xl mx-auto bg-darkBackground">
          <CardContent>
            <form
              // onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-10 py-6 px-5"
            >
              {/* Name Fields */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={methods.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Bio & Location */}
              <div className="space-y-8">
                <FormField
                  control={methods.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="w-full text-base"
                          rows={4}
                          maxLength={300}
                          placeholder="Write a short bio about yourself..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <FormField
                    control={methods.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            <div className="relative h-9 bg-darksec w-full cursor-default overflow-hidden rounded-md  text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-darkBackground focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-700 sm:text-sm">
                              <div className="bg-darkBackground border border-input rounded-md">
                                <Combobox.Input
                                  className="w-full text-darkTextPrimary bg-darkBackground border-none py-[0.450rem] pl-3 pr-10 text-sm leading-5  focus:ring-0 rounded-md "
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




                            <Combobox.Options className=" text-darkTextPrimary  absolute mt-1 max-h-60 w-full overflow-auto  bg-darkBackground py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary text-darkTextPrimary' : 'text-darkTextPrimary'
                                      }`
                                    }
                                    value={institute.name}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                            }`}
                                        >
                                          {institute.name}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-darkTextPrimary' : 'text-primary'
                                              }`}
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
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex px-2 py-1 h-6  text-xs font-medium leading-4 border  rounded-lg text-darkTextPrimary items-center justify-center gap-x-1  box-border 
                      bg-darksec 
                      hover:shadow-tag-hover transition-all ease-in-out select-none group/tag group"
                    >
                      <span>{skill}</span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-0.5  w-4 h-4 p-0 hover:text-red-600 "
                        onClick={() =>
                          setSkills(skills.filter((_, i) => i !== index))
                        }
                      >
                        <X size={4} />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSkill}
                    style={hackerMedium.style}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <div
                      key={index}
                      className="flex bg-darksec px-2 py-1 h-6  text-xs font-medium leading-4 border  rounded-lg text-darkTextPrimary  items-center justify-center gap-x-1  box-border hover:shadow-tag-hover transition-all ease-in-out select-none group/tag group"
                    >
                      <span>{interest}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-0.5  w-4 h-4 p-0 hover:text-red-600 "
                        onClick={() =>
                          setInterests(interests.filter((_, i) => i !== index))
                        }
                      >
                        <X size={4} />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddInterest}
                    style={hackerMedium.style}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Social Links component comes here  */}
              <SocialLinkComponent
                socialLinks={socialLinks}
                setSocialLinks={setSocialLinks}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};

