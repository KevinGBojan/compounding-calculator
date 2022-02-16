import { emailMagicLink } from "../../lib/firebase";
import * as Yup from "yup";
import { useContext, useEffect } from "react";
import { UserContext } from "../../lib/context";
import { useRouter } from "next/router";
import SignUpForm from "../../components/SignUpForm";

// Formik
import { Formik, Form } from "formik";

const initialValues = {
  emailExists: false,
  email: "",
  firstName: "",
  lastName: "",
};

const validationSchema = Yup.object({
  emailExists: Yup.boolean(),
  email: Yup.string()
    .email("Please provide a valid email!")
    .required("Please provide an email."),
  firstName: Yup.string().when("emailExists", {
    is: false,
    then: Yup.string().required("A first name is required."),
  }),
  lastName: Yup.string().when("emailExists", {
    is: false,
    then: Yup.string().required("A last name is required."),
  }),
});

export default function Page({}) {
  // Redirect to homepage if user is logged in
  const { user } = useContext(UserContext);
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
          <Form>
            <SignUpForm
              valid={formik.isValid}
              submitting={formik.isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
