import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { useMutation } from "@tanstack/react-query"
  import { toast } from "react-hot-toast"
import useAxios from "@/hooks/useAxios"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
  
  export function DeleteConfirmDialog({ open, onClose,url, id, refetch,navigateLink }) {

const navigate = useNavigate()
    const axiosCommon = useAxios()
    const { mutateAsync, isPending } = useMutation({
      mutationFn: async () => {
        const { data } = await axiosCommon.delete(`${url}/${id}`)
        return data
      },
      onSuccess: () => {
        toast.success("Deleted successfully.")
        onClose()
        refetch?.()
        if (navigateLink) {
           navigate(navigateLink)
         
        }
         
    
      },
      onError: () => {
        toast.error("An error occurred while deleting.")
      },
    })
  
    const handleDelete = async () => {
      await mutateAsync({ id })
    }
  
    return (
        <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md rounded-3xl shadow-xl p-6 text-black ">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold ">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-lg  opacity-90">
              Are you sure you want to permanently delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
  
          <div className="mt-3 space-y-4">
            <div>
              <p className="text-lg ">This action will permanently delete the item.</p>
            </div>
            <div className="flex justify-between gap-4 mt-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-1/3 py-3  border-gray-400  hover:bg-white hover:text-gray-900  transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                className="w-1/3 py-3 text-white bg-red-600 hover:bg-red-800  transition-all duration-300"
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  DeleteConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    refetch: PropTypes.func,
    navigateLink: PropTypes.any,
  }