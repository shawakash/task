const { List } = require("../db/mongoose");
const { ListCreateSchema, UploadUserSchema } = require("../utils/valid");
const csv = require("csv-parser");
const fs = require("fs");

const listRouter = require("express").Router();

listRouter.post("/create", async (req, res) => {
  try {
    const { title, customProperties } = ListCreateSchema.parse(req.body);

    const list = new List({ title, customProperties });
    await list.save();

    return res.status(201).json({
      list,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
    });
  }
});

listRouter.post("/upload", async (req, res) => {
  try {
    const { listId } = UploadUserSchema.parse(req.query);
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    const csvData = [];
    const errorRows = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => csvData.push(data))
      .on("error", (error) => res.status(400).json({ error: error.message }))
      .on("end", async () => {
        const customProperties = list.customProperties.reduce((obj, prop) => {
          obj[prop.title] = prop.defaultValue;
          return obj;
        }, {});

        const users = csvData.map((row) => {
          const user = {
            name: row.name,
            email: row.email,
            properties: { ...customProperties },
          };

          for (const [key, value] of Object.entries(row)) {
            if (key === "name" || key === "email") continue;
            if (customProperties[key]) {
              user.properties[key] = value || customProperties[key];
            }
          }

          return user;
        });

        const validUsers = [];
        const invalidUsers = [];

        for (const user of users) {
          try {
            await user.save();
            validUsers.push(user);
          } catch (error) {
            if (error.code === 11000) {
              // Duplicate email error
              errorRows.push({ ...user, error: "Duplicate email" });
            } else {
              errorRows.push({ ...user, error: error.message });
            }
            invalidUsers.push(user);
          }
        }

        list.users.push(...validUsers);
        await list.save();

        return res.status(200).json({
          message: "CSV processed successfully",
          validUsers: validUsers.length,
          invalidUsers: invalidUsers.length,
          totalUsers: list.users.length,
          errorRows,
        });
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = listRouter;
