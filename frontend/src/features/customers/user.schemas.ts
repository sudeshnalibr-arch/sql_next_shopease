import * as yup from "yup";

const roleSchema = yup
  .mixed<"manager" | "staff">()
  .oneOf(["manager", "staff"])
  .required("Role is required.");

export const createUserSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2)
    .max(100)
    .required("Name is required."),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(150)
    .required("Email is required."),

  password: yup
    .string()
    .min(8)
    .max(72)
    .required("Password is required."),

  role: roleSchema,

  managerId: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .when("role", {
      is: "staff",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.strip(),
    }),
});

export const updateUserSchema = yup
  .object({
    name: yup.string().trim().min(2).max(100),

    email: yup.string().trim().email().max(150),

    isActive: yup.boolean(),
  })
  .test(
    "at-least-one-field",
    "Provide at least one field to update.",
    (value) =>
      Boolean(
        value &&
          Object.values(value).some(
            (field) => field !== undefined,
          ),
      ),
  );

export type CreateUserFormValues = yup.InferType<
  typeof createUserSchema
>;

export type UpdateUserFormValues = yup.InferType<
  typeof updateUserSchema
>;