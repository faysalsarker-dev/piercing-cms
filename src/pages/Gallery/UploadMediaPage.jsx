import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UploadMediaPage = () => {
  const axiosCommon = useAxios();
  const [mediaFile, setMediaFile] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("active");
  const [serial, setSerial] = useState("");
const navigate = useNavigate();


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);
    setUrlInput("");
    setPreviewUrl(URL.createObjectURL(file));

    if (file.type.startsWith("image/")) setType("image");
    else if (file.type.startsWith("video/")) setType("video");
  };

 const handleUrlChange = (e) => {
  const link = e.target.value.trim();
  setUrlInput(link);
  setMediaFile(null);
  setPreviewUrl(link);
  setType(link ? "link" : "");
};


  const { mutate: uploadMedia, isPending } = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosCommon.post("/gallery", formData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Upload successful!");
      setMediaFile(null);
      setUrlInput("");
      setPreviewUrl(null);
      setSerial("");
      setType("");
      navigate("/gallery"); 
    },
    onError: (error) => {
      console.error(error);
      toast.error("Upload failed.");
    },
  });

  const handleUpload = () => {
    if ((!mediaFile && !urlInput) || !type || !serial) {
      toast.error("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    if (mediaFile) formData.append("file", mediaFile);
    if (urlInput) formData.append("url", urlInput);

    formData.append("type", type);
    formData.append("status", status);
    formData.append("serial", serial);

    uploadMedia(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <Card className="shadow-xl border rounded-2xl">
        <CardContent className="space-y-5 p-6">
          <h2 className="text-xl font-semibold text-center">Upload Media</h2>

          <div>
            <Label htmlFor="file">Choose File</Label>
            <Input
              id="file"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={!!urlInput}
            />
          </div>

          <div>
            <Label htmlFor="url">Or Add Media URL (Image, Video, YouTube)</Label>
            <Input
              id="url"
              type="text"
              value={urlInput}
              onChange={handleUrlChange}
              placeholder="https://example.com/video.mp4 or YouTube link"
              disabled={!!mediaFile}
            />
          </div>

         
{previewUrl && (
  <div className="rounded-lg border p-2">
    {/\.(jpeg|jpg|png|gif|webp)$/i.test(previewUrl) ? (
      <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-cover rounded" />
    ) : /\.(mp4|webm|ogg)$/i.test(previewUrl) ? (
      <video src={previewUrl} controls className="w-full max-h-64 rounded" />
    ) : (
      <iframe
        src={previewUrl}
        title="Media Preview"
        className="w-full h-64 rounded"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
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
              placeholder="Enter serial number"
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <Button onClick={handleUpload} disabled={isPending} className="w-full bg-primary">
            {isPending ? "Uploading..." : "Upload"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadMediaPage;
