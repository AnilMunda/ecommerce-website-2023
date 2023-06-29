import userModels from "../models/userModels.js";
import orderModels from "../models/orderModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
// import Orders from './../client/src/pages/user/Orders';

export const registerController = async (req, res) => {
  try {
    const { name, email, phone, address, password, answer } = req.body;

    // validation
    if (!name) {
      return res.send({ message: "Name is rquired" });
    }
    if (!email) {
      return res.send({ message: "email is rquired" });
    }

    if (!phone) {
      return res.send({ message: "phone number is rquired" });
    }
    if (!address) {
      return res.send({ message: "address is rquired" });
    }
    if (!password) {
      return res.send({ message: "password is rquired" });
    }

    if (!answer) {
      return res.send({ message: "answer is rquired" });
    }
    // check user
    const existingUser = await userModels.findOne({ email });

    //  existingUser
    if (existingUser) {
      res.status(200).send({
        sucess: false,
        message: "Already Register Please Login",
      });
    }
    // register user
    const hashedPassword = await hashPassword(password);
    // console.log(hashedPassword);
    // save
    const user = await new userModels({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in the registeration",
      error,
    });
  }
};

// POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // check
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registred",
      });
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password  is required" });
    }

    // check
    const user = await userModels.findOne({ email, answer });
    //
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModels.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went Wrong",
      error,
    });
  }
};

// test controller

export const testController = (req, res) => {
  try {
    res.send("Protected route");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// update profile

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModels.findByIdAndUpdate(req.user._id);

    // password
    if (!password && password.length < 6) {
      return res.JSON({ error: "Password is required and 6 characters long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updateUser = await userModels.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while update profile",
      error,
    });
  }
};

// orders
export const getOrderController = async (req, res) => {
  try {
    const orders = await orderModels
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

// all orders
export const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModels
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

// order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModels.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while Updating order",
      error,
    });
  }
};
