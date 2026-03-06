"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, UserX } from "lucide-react";
import SubscriberForm from "@/components/SubscriberForm";

export default function EditSubscriberModal({
  subscriber,
}: {
  subscriber: any;
}) {
  return (
    <Dialog>
     
      <DialogTrigger asChild>
        <button
            type="button"
            title="Edit Subscriber"
            className="p-1 text-gray-600 hover:text-black"
        >
            <Pencil className="h-4 w-4" />
        </button>
        </DialogTrigger>


      <DialogContent className="max-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-orangeButton">
            Edit Subscriber
          </DialogTitle>
        </DialogHeader>

        <SubscriberForm
          mode="edit"
          initialData={{
            company: subscriber.company,
            email: subscriber.email,
            plan: subscriber.plan.toLowerCase(),
            status: subscriber.status.toLowerCase(),
            users: subscriber.users.toString(),
          }}
          onSubmit={(data) => {
            console.log("EDIT SUBSCRIBER:", data);
          }}
          onCancel={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
}
