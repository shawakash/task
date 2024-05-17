let { z } = require("zod");

const ListCreateSchema = z.object({
  title: z.string().nonempty(),
  customProperties: z.array(
    z.object({
      title: z.string().nonempty(),
      defaultValue: z.string().nonempty(),
    }),
  ),
});

const UploadUserSchema = z.object({
  listId: z.string().nonempty(),
});

module.exports = { ListCreateSchema, UploadUserSchema };
