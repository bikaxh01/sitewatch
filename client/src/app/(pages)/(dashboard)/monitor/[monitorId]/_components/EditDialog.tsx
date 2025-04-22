import React, {
  ActionDispatch,
  Dispatch,
  FormEvent,
  FormEventHandler,
  SetStateAction,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { handleClientScriptLoad } from "next/script";
import { Monitor } from "../../../monitors/_components/MonitorsTable";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DialogProp {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  monitorDetail: Monitor;
}
function EditDialog({ open, setOpen, monitorDetail }: DialogProp) {
  const [monitorUrl, setMonitorUrl] = useState(monitorDetail.url);

  const [monitorName, setMonitorName] = useState(monitorDetail.monitorName);

  const [checkInterval, setCheckInterval] = useState(
    monitorDetail.checkInterval.toString()
  );
  const router = useRouter()

  const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setOpen(false)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/url/update-monitor?monitorId=${monitorDetail.id}`,
        {
          monitorName,
          checkInterval,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("updated Successfully");
      location.reload()
    } catch (error) {
      toast.error("something went wrong");
    }
 
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your monitor</DialogTitle>
          <form className="  p-2 flex flex-col gap-2" onSubmit={handelSubmit}>
            <div className=" flex flex-col gap-y-1.5">
              <label className=" text-xs ">Monitor Name:</label>
              <input
                value={monitorName}
                onChange={(e) => setMonitorName(e.target.value)}
                className="  border-2 w-full  h-10 rounded-md text-sm p-2"
                placeholder="Personal portfolio"
              />
            </div>
            <div className=" flex flex-col gap-y-1.5">
              <label className=" text-xs">Monitor Url:</label>
              <input
                value={monitorUrl}
                disabled
                onChange={(e) => setMonitorUrl(e.target.value)}
                className=" w-full border-2 h-10 rounded-md text-sm p-2"
                placeholder="https://example.com"
              />
            </div>
            <div className=" flex flex-col gap-y-1.5">
              <select
                name="interval"
                id="check status"
                defaultValue="3"
                value={checkInterval}
                onChange={(e) => setCheckInterval(e.target.value)}
                className="w-60 border-2 rounded-md p-2 bg-accent"
              >
                <option value="3">3</option>
                <option value="5">5</option>
              </select>
            </div>
            <Button type="submit">
              <span>Save Changes</span>
              <Save />
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog;
