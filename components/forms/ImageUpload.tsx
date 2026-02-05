"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadImageToSanity } from "@/lib/sanity/upload";
import { cn } from "@/lib/utils";

export interface ImageItem {
  id: string;
  url: string;
  assetRef: string;
  isUploading?: boolean;
}

interface ImageUploadProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 10,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      const remainingSlots = maxImages - images.length;
      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      if (filesToUpload.length === 0) return;

      setUploading(true);

      // Create placeholder items for uploading state
      const placeholders: ImageItem[] = filesToUpload.map((file, index) => ({
        id: `uploading-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        assetRef: "",
        isUploading: true,
      }));

      onChange([...images, ...placeholders]);

      try {
        const uploadPromises = filesToUpload.map(async (file, index) => {
          const formData = new FormData();
          formData.append("file", file);

          const uploaded = await uploadImageToSanity(formData);
          const assetId = uploaded.asset._ref;

          return {
            id: assetId,
            url: `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${assetId.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp").replace("-jpeg", ".jpeg")}`,
            assetRef: assetId,
            placeholderIndex: index,
          };
        });

        const uploadedImages = await Promise.all(uploadPromises);

        // Replace placeholders with actual uploaded images
        onChange([
          ...images,
          ...uploadedImages.map(({ id, url, assetRef }) => ({
            id,
            url,
            assetRef,
            isUploading: false,
          })),
        ]);
      } catch (error) {
        console.error("Upload failed:", error);
        // Remove placeholders on error
        onChange(images);
      } finally {
        setUploading(false);
      }
    },
    [images, onChange, maxImages, disabled],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    disabled: disabled || uploading || images.length >= maxImages,
    multiple: true,
  });

  const handleRemove = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(images);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          (disabled || uploading || images.length >= maxImages) &&
            "opacity-50 cursor-not-allowed",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? "Drop images here..."
                  : "Drag & drop images here, or click to select"}
              </p>
              <p className="text-xs text-muted-foreground">
                {images.length}/{maxImages} images
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Previews with Drag & Drop Reordering */}
      {images.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-3"
              >
                {images.map((image, index) => (
                  <Draggable
                    key={image.id}
                    draggableId={image.id}
                    index={index}
                    isDragDisabled={disabled || image.isUploading}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "relative group rounded-lg overflow-hidden border bg-muted",
                          snapshot.isDragging &&
                            "ring-2 ring-primary shadow-lg",
                          image.isUploading && "opacity-50",
                        )}
                        style={{
                          ...provided.draggableProps.style,
                          width: 120,
                          height: 120,
                        }}
                      >
                        <Image
                          src={image.url}
                          alt={`Property image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />

                        {/* Uploading overlay */}
                        {image.isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          </div>
                        )}

                        {/* Controls overlay */}
                        {!image.isUploading && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {/* Drag handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="p-1.5 bg-white/90 rounded-md cursor-grab hover:bg-white"
                            >
                              <GripVertical className="h-4 w-4 text-gray-700" />
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemove(image.id)}
                              className="p-1.5 bg-red-500 rounded-md hover:bg-red-600"
                              disabled={disabled}
                            >
                              <X className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        )}

                        {/* Image number badge */}
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Drag images to reorder. First image will be the main listing photo.
        </p>
      )}
    </div>
  );
}
