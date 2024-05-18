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

const SendMailSchema = z.object({
  listId: z.string().nonempty(),
  emailBody: z.string().nonempty(),
  subject: z.string().nonempty(),
});

module.exports = { ListCreateSchema, UploadUserSchema, SendMailSchema };
