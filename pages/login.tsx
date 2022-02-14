import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { auth, provider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { UserContext } from "../lib/context";

export default function Page({}) {
  //TODO: Passwordless sign in with name and email.
  //TODO: Google sign in.
  // Save details to database after sign up: user?.uid, user?.displayName
  const { user } = useContext(UserContext);

  // Redirect to homepage if user is logged in
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

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
          className="mt-40 flex rounded-md bg-[#5C43F5] p-4 font-semibold text-white transition ease-in-out hover:bg-[#705DF2]"
        >
          <FaGoogle size="24" className="mr-4" />
          <span>Sign In With Google</span>
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
        className="mt-40 flex rounded-md bg-pallet-100 p-4 text-white"
      >
        <span>Sign Out</span>
      </button>
    </section>
  );
}
