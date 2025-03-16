import { Client, Storage, ID, ImageGravity, ImageFormat } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

const storage = new Storage(client);

export const createImage = async (image: File) => {
  try {
    const response = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
      ID.unique(),
      image
    );
    if (response.$id) {
      return { status: "success", id: response.$id };
    } else {
      return { status: "failes" };
    }
  } catch (err) {
    console.log("appwrite :: createImage :: error :: ", err.message);
    return { status: "error", err: err.message };
  }
};

export const deleteImage = async (id: string) => {
  try {
    const res = await storage.deleteFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
      id
    );
    console.log(`${id} deleted :: res :: `, res);
  } catch (err) {
    console.log("appwrite :: deleteImage :: error :: ", err.message);
  }
};

// export const deleteAllTheImagesInTheBucket = async () => {
//   try {
//     const data = await storage.listFiles(
//       process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string
//     );
//     const imagesId = await data.files.map((file: any) => file.$id);
//     console.log(imagesId);
//     for (let id of imagesId) {
//       const res = await storage.deleteFile(
//         process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
//         id
//       );
//       console.log(`${id} deleted :: res :: `, res);
//     }
//   } catch (err) {
//     console.log(
//       "appwrite :: deleteAllTheImagesInTheBucket :: error :: ",
//       err.message
//     );
//   }
// };

// export const getImage = async (id: string) => {
//   try {
//     const result = storage.getFilePreview(
//       process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
//       id, // file ID
//       1800, // width, will be resized using this value.
//       0, // height, ignored when 0 // crop center
//       "top",
//       "90", // slight compression
//       5, // border width
//       "CDCA30", // border color
//       15, // border radius
//       1, // full opacity
//       0, // no rotation
//       "FFFFFF", // background color
//       "jpg" // output jpg format
//     );
//     return result.href;
//   } catch (err) {
//     console.log("appwrite :: getImage :: error :: ", err.message);
//   }
// };

export const getImage = async (id: string) => {
  try {
    const result = storage.getFilePreview(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
      id,
      1800,
      0,
      "center" as ImageGravity, // Changed from 'top' to 'center'
      90,
      5,
      "CDCA30",
      15,
      1,
      0,
      "FFFFFF",
      "jpg" as ImageFormat
    );

    return result; // Remove .href as the result is already a string
  } catch (err) {
    console.error(
      "appwrite :: getImage :: error :: ",
      err instanceof Error ? err.message : String(err)
    );
    return undefined;
  }
};
