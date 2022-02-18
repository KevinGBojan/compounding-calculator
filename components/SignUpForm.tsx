// Formik
import { doc, getDoc } from "firebase/firestore";
import {
  FastField,
  ErrorMessage,
  useFormikContext,
  FormikValues,
} from "formik";
import debounce from "lodash.debounce";
import { useCallback, useEffect } from "react";
import { db } from "../lib/firebase";

const SignUpForm = ({
  valid,
  submitting,
}: {
  valid: boolean;
  submitting: boolean;
}) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const { email, emailExists } = values;

  // Check if user exists and ask for firstName and lastName if true
  const checkUserEmail = useCallback(
    debounce(async (email: string | undefined) => {
      if (!email) return;
      const docSnap = await getDoc(doc(db, "users", `${email}`));
      if (docSnap.exists()) {
        setFieldValue("emailExists", true);
      } else {
        setFieldValue("emailExists", false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUserEmail(email);
  }, [email, checkUserEmail]);

  return (
    <div className="grid grid-cols-2 gap-y-12 gap-x-8 px-[10px] text-white md:px-20 lg:gap-x-12 lg:px-32 xl:px-52 2xl:px-80">
      <div className="relative col-span-2 flex items-center rounded-lg bg-[#48448061] p-4">
        <label htmlFor="email" className="font-semibold">
          Email <span className="text-gray-500">*</span>
        </label>
        <FastField
          className="lg:pl-46 absolute inset-0 rounded-lg bg-transparent pl-32 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl md:pl-40"
          type="text"
          name="email"
        />
        <ErrorMessage name="email">
          {(errorMsg) => (
            <div className="absolute top-16 left-0 text-red-500">
              {errorMsg}
            </div>
          )}
        </ErrorMessage>
      </div>
      {!emailExists && (
        <>
          <div className="relative col-span-2 flex items-center rounded-lg bg-[#48448061] p-4 md:col-span-1">
            <label htmlFor="email" className="font-semibold">
              First Name <span className="text-gray-500">*</span>
            </label>
            <FastField
              className="lg:pl-46 absolute inset-0 rounded-lg bg-transparent pl-32 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl md:pl-40"
              type="text"
              name="firstName"
            />
            <ErrorMessage name="firstName">
              {(errorMsg) => (
                <div className="absolute top-16 left-0 text-red-500">
                  {errorMsg}
                </div>
              )}
            </ErrorMessage>
          </div>
          <div className="relative col-span-2 flex items-center rounded-lg bg-[#48448061] p-4 md:col-span-1">
            <label htmlFor="email" className="font-semibold">
              Last Name <span className="text-gray-500">*</span>
            </label>
            <FastField
              className=" lg:pl-46 absolute inset-0 rounded-lg bg-transparent pl-32 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl md:pl-40"
              type="text"
              name="lastName"
            />
            <ErrorMessage name="lastName">
              {(errorMsg) => (
                <div className="absolute top-16 left-0 text-red-500">
                  {errorMsg}
                </div>
              )}
            </ErrorMessage>
          </div>
        </>
      )}
      <button
        type="submit"
        disabled={!valid || submitting}
        className="col-span-2 rounded-lg bg-[#5C43F5] px-5 py-3 font-semibold text-white hover:bg-[#705DF2]"
      >
        Submit
      </button>
    </div>
  );
};

export default SignUpForm;
