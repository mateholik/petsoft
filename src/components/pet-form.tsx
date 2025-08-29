import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type PetFormProps = {
  actionType: "add" | "edit";
};

export default function PetForm({ actionType }: PetFormProps) {
  return (
    <form className="flex flex-col">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="Pet's name" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner name</Label>
          <Input id="ownerName" type="text" placeholder="Owner's name" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image url</Label>
          <Input id="imageUrl" type="text" placeholder="Pet's name" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" placeholder="Pet's name" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Notes</Label>
          <Textarea />
        </div>
      </div>
      <Button className="mt-5 self-end" type="submit">
        {actionType === "add" ? "Add new pet" : "Edit pet"}
      </Button>
    </form>
  );
}
