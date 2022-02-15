import { useEffect, useContext } from "react";
import router, { useRouter } from "next/router";
import { auth, provider } from "../../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { FaGoogle, FaEnvelopeOpen } from "react-icons/fa";
import { UserContext } from "../../lib/context";

export default function Page({}) {
  //TODO: Passwordless sign in with name and email.
  const { user } = useContext(UserContext);

  // Redirect to homepage if user is logged in
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <main className="flex flex-col items-center">
      {user ? <SignOutButton /> : <SignInButton />}
    </main>
  );
}

// Sign In With Google Button

function SignInButton() {
  const SignInWithGoogle = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={SignInWithGoogle}
          className="mt-40 flex w-64 items-center justify-center rounded-md bg-[#5C43F5] p-4 font-semibold text-white transition ease-in-out hover:bg-[#705DF2]"
        >
          <FaGoogle size="24" className="mr-4" />
          <span>Sign In With Google</span>
        </button>
        <button
          onClick={() => router.push("/login/link")}
          className="mt-8 flex w-64 items-center justify-center rounded-md bg-[#5C43F5] p-4 font-semibold text-white transition ease-in-out hover:bg-[#705DF2]"
        >
          <FaEnvelopeOpen size="24" className="mr-4" />
          Sign In With Email Link
        </button>
      </div>
    </section>
  );
}

// Sign Out Btn
export function SignOut() {
  signOut(auth);
}

function SignOutButton() {
  return (
    <section>
      <button
        onClick={SignOut}
        className="bg-pallet-100 mt-40 flex rounded-md p-4 text-white"
      >
        <span>Sign Out</span>
      </button>
    </section>
  );
}
