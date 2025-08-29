import { usePetContext } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { handleAddPet } = usePetContext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newPet = {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl:
        (formData.get("imageUrl") as string) ||
        "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      age: Number(formData.get("age") as string),
      notes: formData.get("notes") as string,
    };

    handleAddPet(newPet);
    onFormSubmission();
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner name</Label>
          <Input id="ownerName" type="text" name="ownerName" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image url</Label>
          <Input id="imageUrl" type="text" name="imageUrl" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input name="age" id="age" type="number" required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" required />
        </div>
      </div>
      <Button className="mt-5 self-end" type="submit">
        {actionType === "add" ? "Add new pet" : "Edit pet"}
      </Button>
    </form>
  );
}
