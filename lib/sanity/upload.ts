"use server";

import { client } from "./client";

export interface UploadedImage {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
}

export async function uploadImageToSanity(
  formData: FormData,
): Promise<UploadedImage> {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  // Convert File to Buffer for Sanity upload
  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to Sanity assets
  const asset = await client.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type,
  });

  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}

export async function uploadMultipleImagesToSanity(
  formData: FormData,
): Promise<UploadedImage[]> {
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    throw new Error("No files provided");
  }

  const uploadPromises = files.map(async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: asset._id,
      },
    };
  });

  return Promise.all(uploadPromises);
}

export async function deleteImageFromSanity(assetId: string): Promise<void> {
  try {
    await client.delete(assetId);
  } catch (error) {
    console.error("Failed to delete asset:", error);
    // Don't throw - the asset might be referenced elsewhere
  }
}
