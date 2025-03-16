"use client";
import { hackerMedium } from "@/fonts/font"
import React, { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { createImage } from "@/lib/appwrite/appwrite";
import { Avatar } from "@/components/ui/avatar";



import { useUser } from "@clerk/nextjs";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useToast } from "@/hooks/use-toast";
import { DiscussionCreateFooter } from "@/app/discussions/component/discussion-create-fotter";
import { motion } from "framer-motion";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";

// poll
import { PollCreator } from "@/app/discussions/component/poll-create";

// collab
import { CollabCreator } from "@/app/discussions/component/discussion-collab-create";

enum Category {
  General = "General",
  Competitions = "Competitions",
  Events = "Events",
  Feedback = "Feedback",
  Other = "Other",
}

interface CreateDiscussionInterface {
  title: string;
  content: string;
  images: File[];
  category: Category;
  poll?: {
    options: string[];
  };
  collab?: {
    category: string;
    numPeopleNeeded: number;
  };
}


export function CreateDiscussionModal() {
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showCollabCreator, setShowCollabCreator] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };


  const initialFormData: CreateDiscussionInterface = {
    title: "",
    content: "",
    images: [],
    category: Category.General,
    poll: undefined,
  };

  const [formData, setFormData] =
    useState<CreateDiscussionInterface>(initialFormData);
  const [wordCount, setWordCount] = useState(0);


  const onEmojiClick = (emojiObject) => {
    const { emoji } = emojiObject;
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.content;
      const newText = text.substring(0, start) + emoji + text.substring(end);
      setFormData(prev => ({ ...prev, content: newText }));
    }
    setShowEmojiPicker(false);
  };

  const handleCollabCreate = (collabData: { category: string; numPeopleNeeded: number }) => {
    setFormData(prev => ({
      ...prev,
      collab: collabData
    }));
    setShowCollabCreator(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setFormData((prev) => ({ ...prev, content: text }));
    setWordCount(text.length);
  };

  const setMultipleImage = useCallback((images: File[]) => {
    setFormData((prev) => ({ ...prev, images }));
  }, []);

  const getImages = async () => {
    const ids: string[] = [];
    for (const file of formData.images) {
      const res = await createImage(file);
      if (res.status === "success") {
        ids.push(res.id);
      } else {
        toast({
          title: "Error Uploading Image",
          description: "Something went wrong while uploading the image",
        });
      }
    }
    return ids;
  };


  const handlePollCreate = (options: string[]) => {
    setFormData(prev => ({
      ...prev,
      poll: {
        options
      }
    }));
    setShowPollCreator(false);
  };


  const CreateDiscussion = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (formData.content.length > 1000) {
        toast({
          title: "Error Creating Discussion",
          description: "Content is too long",
        });
        return;
      }
      if (formData.content.length < 4) {
        toast({
          title: "Error Creating Discussion",
          description: "Content is too short",
        });
        return;
      }
      if (formData.title.length > 100) {
        toast({
          title: "Error Creating Discussion",
          description: "Title is too long",
        });
        return;
      }
      if (formData.images.length > 4) {
        toast({
          title: "Error Creating Discussion",
          description: "Too many images; max 4 images",
        });
        return;
      }

      const res = await fetch(`/api/discussion/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          images: await getImages(),
          clerkUserId: user.id,
          authorMongoId: user.publicMetadata.mongoDbUserId,
        }),
      });

      const data = await res.json();

      if (data.message === "success") {
        toast({
          color: "#0056FE",
          title: "Discussion Created",
          description: "Your discussion has been created",
        });
        setFormData(initialFormData);
        setWordCount(0);
        closeDialog();
      } else {
        toast({
          title: "Error Creating Discussion",
          description: "Something went wrong while creating the discussion",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} >

      <DialogTrigger asChild>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="group z-30 w-full border-b border-darkBorder bg-darksec/20 hover:bg-darksec/40 transition-all duration-300 cursor-pointer hidden  lg:block"
        >
          <div className="flex items-start gap-4 p-4">
            <Avatar className="w-12 h-12 border-2 border-darkBorder  ring-offset-2 ring-offset-darkBackground">
              <Image
                src={user.imageUrl}
                alt="User"
                width={46}
                height={46}
                className="rounded-full object-cover"
                priority
              />
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="relative">
                <div className="w-full cursor-pointer bg-transparent text-darkTextSecondery placeholder:text-darkTextSecondery/60 text-lg z-10 focus:outline-none py-2 font-medium">
                  Share your thoughts...
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center -ml-2 gap-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className=" text-darkTextSecondery hover:text-darkTextPrimary hover:bg-darksec rounded-lg transition-colors duration-200"
                  >

                    <DynamicSvgIcon
                      isActive={false}
                      src='/image.svg'
                      size={20}
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className=" text-darkTextSecondery hover:text-darkTextPrimary hover:bg-darksec rounded-lg transition-colors duration-200"
                  >
                    <DynamicSvgIcon
                      src='/flex-icon-set/poll.svg'
                      isActive={false}
                      size={20}

                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className=" text-darkTextSecondery hover:text-darkTextPrimary hover:bg-darksec rounded-lg transition-colors duration-200"
                  >
                    <DynamicSvgIcon
                      src='/smile-emoji.svg'
                      isActive={false}
                      size={20}

                    />
                  </motion.div>

                </div>

                <div className='flex space-x-3 justify-center items-center'>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={hackerMedium.style}
                    className="px-4 py-1 flex justify-center items-center space-x-2 border-darkBorder border-2 bg-darksec hover:scale-125 text-white rounded-full text-sm  font-medium transition-colors relative "

                  >
                    <span>Collab</span>

                    <DynamicSvgIcon
                      isActive={false}
                      src="/collabs.svg"
                      size={17}
                    />
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={hackerMedium.style}
                    className="px-4 py-1 bg-primary hover:bg-primary/90 text-white rounded-2xl border-[3px] border-purple-900 font-medium shadow-lg shadow-primary/20 transition-all duration-200 text-sm"
                  >
                    Post
                  </motion.div>
                </div>

              </div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
        </motion.div>



      </DialogTrigger>



      <DialogContent className="sm:max-w-[700px] p-4  bg-darkBackground    ">
        <DialogTitle className="text-white hidden">
          Create Discussion
        </DialogTitle>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 overflow-hidden">
              <Image
                src={user.imageUrl}
                alt="User"
                width={40}
                height={40}
                className="rounded-full object-cover"
                priority
              />
            </Avatar>
          </div>
          <div className="flex items-center gap-2">

            {/* collab action */}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={hackerMedium.style}
              className="px-4 py-1 flex justify-center items-center space-x-2 border-darkBorder border-2 bg-darksec hover:scale-125 text-white rounded-full text-sm  font-medium transition-colors relative "
              onClick={() => setShowCollabCreator(prev => !prev)}
            >
              <span>Collab</span>

              <DynamicSvgIcon
                isActive={false}
                src="/collabs.svg"
                size={17}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={
                hackerMedium.style
              }
              className="px-4 py-1 border-2 border-darkBorder bg-primary hover:scale-125 text-white rounded-full text-sm font-medium transition-colors relative"
              disabled={!formData.content.trim() || isLoading}
              onClick={CreateDiscussion}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                "Post"
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <input
            placeholder="Title (optional)"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full text-lg placeholder-gray-400 focus:outline-none transition-colors dark:bg-darkBackground rounded "
            style={hackerMedium.style}
          />
          <motion.textarea
            initial={{ height: 160 }}
            animate={{ height: formData.content.length > 0 ? "auto" : 160 }}
            placeholder="What are you working on?"
            value={formData.content}
            onChange={handleContentChange}
            className="w-full min-h-[160px] text-base dark:bg-darkBackground placeholder-gray-400 resize-none focus:outline-none transition-colors  rounded "
          />
        </motion.div>


        {showCollabCreator && (
          <div className="mt-4">
            <CollabCreator
              onCollabCreate={handleCollabCreate}
              onCancel={() => setShowCollabCreator(false)}
            />
          </div>
        )}


        {/* Poll Creator */}
        {showPollCreator && (
          <div className="mt-4">
            <PollCreator
              onPollCreate={handlePollCreate}
              onCancel={() => setShowPollCreator(false)}
            />
          </div>
        )}





        <DiscussionCreateFooter
          multipleImage={true}
          setImage={null}
          setMultipleImage={setMultipleImage}
          wordCount={wordCount}
          handlePollSwitch={() => setShowPollCreator(!showPollCreator)}
          onEmojiClick={onEmojiClick}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}

        />

      </DialogContent>
    </Dialog.Root>
  );
}
