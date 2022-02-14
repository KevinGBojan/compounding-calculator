import Link from "next/link";

const Navigation = () => {
  return (
    <div className="mr-[10px] flex h-10v items-center justify-end px-4 sm:px-8 md:px-8 lg:px-20 xl:px-28">
      <Link href="/login">
        <button
          type="button"
          className="rounded-lg bg-[#5C43F5] px-5 py-3 font-semibold text-white hover:bg-[#705DF2]"
        >
          Log In
        </button>
      </Link>
    </div>
  );
};

export default Navigation;
