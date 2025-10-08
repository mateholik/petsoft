import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PetFromBtn from "./pet-form-btn";
import { Resolver, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

const petFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Max chars 100" }),
  ownerName: z
    .string()
    .trim()
    .min(1, { message: "Owner name is required" })
    .max(100, { message: "Max chars 100" }),
  imageUrl: z.union([z.literal(""), z.url({ message: "Invalid URL" }).trim()]),
  age: z.coerce.number().int().positive().max(99999),
  notes: z.union([
    z.literal(""),
    z.string().trim().max(1000, { message: "Max chars 100" }),
  ]),
});
// .transform((data) => ({
//   ...data,
//   imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
// })); THIS WOULD WORK IS WE WOULD USE onSubmit instead of action on html form tag

type TPetForm = z.infer<typeof petFormSchema>;

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema) as Resolver<TPetForm>,
  });

  return (
    <form
      action={async () => {
        const isValid = await trigger();
        if (!isValid) return;

        onFormSubmission();

        const petData = petFormSchema.parse(getValues());

        petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE;

        if (actionType === "add") {
          await handleAddPet(petData);
        } else if (actionType === "edit") {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name", {
              required: "This field is required",
            })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner name</Label>
          <Input
            id="ownerName"
            {...register("ownerName", {
              required: "This field is required",
              maxLength: {
                value: 15,
                message: "max chars 15",
              },
            })}
          />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image url</Label>
          <Input
            id="imageUrl"
            {...register("imageUrl", {
              pattern: {
                value:
                  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                message: "Should be a valid url",
              },
            })}
          />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            {...register("age", {
              required: "This is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Please enter a number",
              },
            })}
          />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes", {
              maxLength: {
                value: 100,
                message: "max chars 100",
              },
            })}
          />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>
      <PetFromBtn actionType={actionType} />
    </form>
  );
}
