// Formik
import { Formik, Form, FormikValues, FastField, ErrorMessage } from "formik";

import { emailMagicLink } from "../../lib/firebase";

import * as Yup from "yup";

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
  // store in local storage
});

export default function Page({}) {
  return (
    <div className="px-4 sm:px-8 md:px-8 lg:px-20 xl:px-28">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          emailMagicLink(values.email);
          actions.setSubmitting(false);
        }}
        validationSchema={validationSchema}
        validateOnChange={false}
      >
        {(formik) => (
          <Form className="grid grid-cols-2 text-white">
            <div className="cols-span-2 relative flex items-center rounded-lg bg-[#48448061] p-4">
              <label htmlFor="email" className="font-semibold">
                Email <span className="text-gray-500">*</span>
              </label>
              <FastField
                className="absolute inset-0 col-span-1 rounded-lg bg-transparent pl-60 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-lg"
                type="text"
                name="email"
              />
              <ErrorMessage name="email">
                {(errorMsg) => (
                  <div className="absolute top-12 text-red-500">{errorMsg}</div>
                )}
              </ErrorMessage>
            </div>
            <div className="cols-span-2 md:cols-span-1 relative flex items-center rounded-lg bg-[#48448061] p-4">
              <label htmlFor="email" className="font-semibold">
                First Name <span className="text-gray-500">*</span>
              </label>
              <FastField
                className="absolute inset-0 col-span-1 rounded-lg bg-transparent pl-60 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-lg"
                type="text"
                name="firstName"
              />
              <ErrorMessage name="firstName">
                {(errorMsg) => (
                  <div className="absolute top-12 text-red-500">{errorMsg}</div>
                )}
              </ErrorMessage>
            </div>
            <div className="cols-span-2 md:cols-span-1 relative flex items-center rounded-lg bg-[#48448061] p-4">
              <label htmlFor="email" className="font-semibold">
                Last Name <span className="text-gray-500">*</span>
              </label>
              <FastField
                className="absolute inset-0 col-span-1 rounded-lg bg-transparent pl-60 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-lg"
                type="text"
                name="lastName"
              />
              <ErrorMessage name="lastName">
                {(errorMsg) => (
                  <div className="absolute top-12 text-red-500">{errorMsg}</div>
                )}
              </ErrorMessage>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
