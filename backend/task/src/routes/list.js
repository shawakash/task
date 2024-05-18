const { List, User } = require("../db/mongoose");
const { ListCreateSchema, UploadUserSchema } = require("../utils/valid");
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});
const upload = multer({ storage });

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

listRouter.post("/upload", upload.single("file"), async (req, res) => {
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
            await new User({ ...user, listId }).save();
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

        fs.unlink(req.file.path, (err) => {
          return res.status(200).json({
            message: "CSV processed successfully",
            validUsersCount: validUsers.length,
            invalidUsersCount: invalidUsers.length,
            totalUsersInList: list.users.length,
            errorRows: errorRows,
          });
        });
      });
  } catch (error) {
    console.error("Error processing upload:", error.message);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(
            "Error occurred while cleaning up the uploaded file:",
            err.message,
          );
        }
      });
    }
    return res
      .status(500)
      .json({ error: "Failed to process upload", details: error.message });
  }
});

module.exports = listRouter;
