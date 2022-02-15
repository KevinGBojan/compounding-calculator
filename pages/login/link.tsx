// Formik
import { Formik, Form, FormikValues, FastField, ErrorMessage } from "formik";

import { emailMagicLink } from "../../lib/firebase";

import * as Yup from "yup";
import { useContext, useEffect } from "react";
import { UserContext } from "../../lib/context";
import { useRouter } from "next/router";

const initialValues = {
  email: "",
  firstName: "",
  lastName: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please provide a valid email!")
    .required("Please provide an email."),
  firstName: Yup.string().required("A first name is required"),
  lastName: Yup.string().required("A last name is required"),
});

export default function Page({}) {
  const { user } = useContext(UserContext);

  // Redirect to homepage if user is logged in
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="px-4 sm:px-8 md:px-8 lg:px-20 xl:px-28">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          emailMagicLink(values.email);
          window.localStorage.setItem(
            "displayName",
            `${values.firstName} ${values.lastName}`
          );
          actions.setSubmitting(false);
          actions.resetForm();
        }}
        validationSchema={validationSchema}
        validateOnChange={false}
      >
        {(formik) => (
          <Form className="grid grid-cols-2 gap-y-12 gap-x-8 px-[10px] text-white md:px-20 lg:gap-x-12 lg:px-32 xl:px-52 2xl:px-80">
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
            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="col-span-2 rounded-lg bg-[#5C43F5] px-5 py-3 font-semibold text-white hover:bg-[#705DF2]"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
