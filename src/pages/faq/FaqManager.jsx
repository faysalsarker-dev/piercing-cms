import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmDialog";

export default function FaqManager() {
  const axiosCommon = useAxios();
  const [editFaq, setEditFaq] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: faqs = [], isLoading, refetch } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => (await axiosCommon.get("/faqs")).data,
  });

  const createFaq = useMutation({
    mutationFn: (faq) => axiosCommon.post("/faqs", faq),
    onSuccess: () => {
      reset();
      refetch();
      setOpenDialog(false);
    },
  });

  const updateFaq = useMutation({
    mutationFn: ({ id, ...faq }) => axiosCommon.put(`/faqs/${id}`, faq),
    onSuccess: () => {
      reset();
      setEditFaq(null);
      refetch();
      setOpenDialog(false);
    },
  });

  const onSubmit = (data) => {
    if (editFaq) {
      updateFaq.mutate({ id: editFaq._id, ...data });
    } else {
      createFaq.mutate(data);
    }
  };

  const onEdit = (faq) => {
    setEditFaq(faq);
    setValue("question", faq.question);
    setValue("answer", faq.answer);
    setOpenDialog(true);
  };

  useEffect(() => {
    if (!openDialog) {
      reset();
      setEditFaq(null);
    }
  }, [openDialog]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardContent className="p-6">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpenDialog(true)}>
                {editFaq ? "Edit FAQ" : "Add New FAQ"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter your question"
                    {...register("question", {
                      required: "Question is required",
                    })}
                  />
                  {errors.question && (
                    <p className="text-sm text-red-500">{errors.question.message}</p>
                  )}
                </div>
                <div>
                  <Textarea
                    placeholder="Enter the answer"
                    {...register("answer", { required: "Answer is required" })}
                  />
                  {errors.answer && (
                    <p className="text-sm text-red-500">{errors.answer.message}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit">{editFaq ? "Update" : "Submit"}</Button>
                  {editFaq && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        reset();
                        setEditFaq(null);
                        setOpenDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <p>Loading FAQs...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq._id}>
                    <TableCell>{faq.question}</TableCell>
                    <TableCell>{faq.answer}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(faq)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setDeleteId(faq._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        id={deleteId}
        url="/faqs"
        refetch={refetch}
      />
    </div>
  );
}
