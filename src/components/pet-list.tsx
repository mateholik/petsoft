import Image from "next/image";

export default function PetList() {
  return (
    <ul className="border-b border-black/[0.08] bg-white">
      <li>
        <button className="flex h-[70px] w-full cursor-pointer items-center gap-3 px-5 text-base transition hover:bg-[#eff1f2] focus:bg-[#eff1f2]">
          <Image
            src="https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
            alt="Pet image"
            width="45"
            height="45"
            className="rounded-full object-cover"
          />
          <p className="font-semibold">Benjamin</p>
        </button>
      </li>
    </ul>
  );
}
