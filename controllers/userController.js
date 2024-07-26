const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const path = require("path");
const { isNil } = require("ramda");
const UserFamily = require("../models/User-Family");
require("dotenv").config();

module.exports = {
  userRegister: async (req, res) => {
    const { name, identity_number, role, email, password } = req.body;

    try {
      const checkEmail = await User.findOne({
        attributes: ["email"],
        where: {
          email: email,
        },
      });

      if (checkEmail) {
        return res.json({
          success: false,
          msg: "Email sudah digunakan!!",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const token = jwt.sign({ email: email }, process.env.SECRET_KEY);

      const user = await User.create({
        fullname: name,
        email,
        password: hashPassword,
        identity_number,
        role,
        token,
      });

      return res.json({
        success: true,
        msg: "success create data",
        data: user,
      });
    } catch (e) {
      return res.json({ msg: e.message });
    }
  },

  userLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });

      const validpass = await bcrypt.compare(password, user.password);
      if (!validpass) {
        return res.json({
          success: false,
          msg: "Password Anda Salah!!",
        });
      }

      return res.json({
        success: true,
        msg: "Anda Berhasil Login!!",
        token: user.token,
        user: user,
      });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  },

  editUser: async (req, res) => {
    try {
      const { email, name, identity_number, family_member_data } = req.body;
      const user = req.userAuth;

      if (req.fileName !== undefined) {
        if (
          user.imageUrl == undefined ||
          user.imageUrl == null ||
          user.imageUrl == ""
        ) {
          user.imageUrl = `images/${req.fileName}`;
        } else {
          await fs.unlink(path.join(`public/images/${user.imageUrl}`));
          user.imageUrl = `images/${req.fileName}`;
        }
      }

      user.fullname = name;
      user.email = email;
      user.identity_number = identity_number;

      const family = await UserFamily.findAll({ where: { user_id: user.id } });
      if (!isNil(family_member_data)) {
        for (const itemFamily of family) {
          const idExists = family_member_data.some(
            (item) => item.id === itemFamily.id
          );
          if (!idExists) {
            itemFamily.destroy();
          }
        }

        const arrayFamilyCreate = [];
        for (const item of family_member_data) {
          const idExists = family.some((itemSome) => itemSome.id === item.id);

          if (idExists) {
            const familyDetail = await UserFamily.findOne({
              where: { id: item.id },
            });
            familyDetail.status = item.family_status_id;
            familyDetail.fullname = item.name;
            familyDetail.save();
          } else {
            arrayFamilyCreate.push({
              fullname: item.name,
              status: item.family_status_id,
              user_id: user.id,
            });
          }
        }

        const createFamily = await UserFamily.bulkCreate(arrayFamilyCreate);
      }

      await user.save();

      return res.json({
        success: true,
        msg: "success update data",
        data: user,
      });
    } catch (e) {
      return res.json({
        success: false,
        msg: e.message,
      });
    }
  },
};
