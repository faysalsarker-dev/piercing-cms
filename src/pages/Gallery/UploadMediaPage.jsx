import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";

const UploadMediaPage = () => {
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [type, setType] = useState(""); // image or video
  const [status, setStatus] = useState("pending");
  const [serial, setSerial] = useState("");
const axiosCommon = useAxios()
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMediaFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (file?.type.startsWith("image/")) setType("image");
    else if (file?.type.startsWith("video/")) setType("video");
  };

  const { mutate: uploadMedia, isLoading } = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosCommon.post("/upload", formData);
      return res.data;
    },
    onSuccess: (data) => {
      alert("Upload successful!");
      setMediaFile(null);
      setPreviewUrl(null);
      setSerial("");
    },
    onError: () => {
      alert("Upload failed.");
    },
  });

  const handleUpload = () => {
    if (!mediaFile || !type || !serial) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", mediaFile);
    formData.append("type", type);
    formData.append("status", status);
    formData.append("serial", serial);

    uploadMedia(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <div>
            <Label htmlFor="file">Upload Image or Video</Label>
            <Input id="file" type="file" accept="image/*,video/*" onChange={handleFileChange} />
          </div>

          {previewUrl && (
            <div className="rounded-lg border p-2">
              {type === "image" ? (
                <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-cover rounded" />
              ) : (
                <video src={previewUrl} controls className="w-full max-h-64 rounded" />
              )}
            </div>
          )}

          <div>
            <Label htmlFor="serial">Serial</Label>
            <Input
              id="serial"
              type="number"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              placeholder="Enter serial"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="w-full p-2 border rounded bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <Button onClick={handleUpload} disabled={isLoading} className="w-full">
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadMediaPage;
