const { z, email } = require("zod");

const nameSchema = z.string().min(20,"Name must be at least 20 characters").max(60,"Name mustbe at most 20 characters");

const addressSchema = z.string().min(1,"Address is requireed").max(400,"Address must be at most 400 characters");

const passwordSchema = z.string()
                        .min(8, "Password must be at least 8 characters")
                        .max(16,"Password must be at most 16 characters")
                        .regex(/[A-Z]/,"Password must contains at least one uppercase letter")
                        .regex(/[!@#$%^&*()<>?,./:"{}|]/,"Password must contains at least one special character");

const emailSchema = z.string().email("Invalid email");

const signupSchema = z.object({
    name:nameSchema,
    email:emailSchema,
    address:addressSchema,
    password:passwordSchema
});

const loginSchema = z.object({
    email:emailSchema,
    password:z.string().min(1,"Password is required")
})

const updatePasswordSchema = z.object({
    oldPassword: z.string().min(1),
    newPassword: passwordSchema
})

const adminCreateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"]),
});

const storeSchema = z.object({
  name: z.string().min(1).max(60),
  email: emailSchema,
  address: addressSchema,
  ownerId: z.number().int().optional().nullable(),
});

function validate(schema){
    return(req, res, next) => {
        const result = schema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                message: "Validation failed!",
                errors: result.error.flatten().fieldErrors
            })
        }
        req.validatedBody = result.data;
        next();
    }
}

const ratingSchema = z.object({
  rating: z.number().int().min(1, "Rating must be 1-5").max(5, "Rating must be 1-5"),
});

module.exports = {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
  adminCreateUserSchema,
  storeSchema,
  ratingSchema,
  validate,
};