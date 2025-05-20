import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

export const EditGalleryDialog = ({ item, onClose, refetch }) => {
  const axiosCommon = useAxios();
  const [status, setStatus] = useState(item.status);
  const [serial, setSerial] = useState(item.serial || 0);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axiosCommon.put(`/gallery/${item._id}`, {
        status,
        serial,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Updated successfully!");
      refetch();
      onClose();
    },
    onError: () => {
      toast.error("Failed to update.");
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Gallery Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Serial</Label>
            <Input
              type="number"
              value={serial}
              onChange={(e) => setSerial(parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => mutate()} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

EditGalleryDialog.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    serial: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};