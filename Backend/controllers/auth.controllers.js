import { User } from "../models/users.models.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAcessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh Token")
    }
}

//register,login,logout,getuser,change current password, refresh access token,update user account details

export const register = asyncHandler(async (req, res) => {
    console.log("Entered registered controller Successfully");

    const { username, email, fullname, password } = req.body;

    if (
        [username, email, fullname, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, " All feilds are compulsorily required!!");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists!!")
    }

    const user = await User.create({
        email,
        fullname,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the User")
    }

    return res.json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export const login = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !username) {
        throw new ApiError(400, "email or username required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(500, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedinUser = await User.findById(user._id).select("-refreshToken", "-password");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedinUser, accessToken, refreshToken
                },
                "User logged in Successfully"
            )
        )
})

export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "current user fetched Succesfully")
        )
})

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(404, "Invalid Old Password");
    }

    user.password = newPassword;
    user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "User Password changed Successfully")
        )
})

export const refreshaccessToken = asyncHandler(async (req, res) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingrefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingrefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingrefreshToken != user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newrefreshToken
                    },
                    "Access token refreshed"
                )
            )
    }
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

export const updateuserDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "All feilds are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, "User details updated successfully"))
})