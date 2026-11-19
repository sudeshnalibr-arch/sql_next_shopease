import * as yup from "yup";

export const createProductSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2)
    .max(150)
    .required("Product name is required."),

  description: yup.string().max(5000).optional(),

  categoryId: yup
    .number()
    .integer()
    .positive()
    .required("Select a category."),

  price: yup
    .number()
    .typeError("Enter a valid price.")
    .positive("Price must be greater than zero.")
    .required("Price is required."),

  stock: yup
    .number()
    .typeError("Enter a valid stock quantity.")
    .integer()
    .min(0)
    .required("Stock is required."),

  image: yup.string().url().nullable().optional(),
});

export const updateProductSchema = yup
  .object({
    name: yup.string().trim().min(2).max(150),

    description: yup.string().max(5000).nullable(),

    categoryId: yup.number().integer().positive(),

    price: yup.number().positive(),

    stock: yup.number().integer().min(0),

    image: yup.string().url().nullable(),

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

export type CreateProductFormValues = yup.InferType<
  typeof createProductSchema
>;

export type UpdateProductFormValues = yup.InferType<
  typeof updateProductSchema
>;