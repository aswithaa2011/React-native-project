import UserProfile from "../models/UserProfile.js";

export const createUserProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const existingProfile = await UserProfile.findOne({ email });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "UserProfile already exists for this email",
      });
    }

    const newProfile = await UserProfile.create(req.body);

    return res.status(201).json({
      success: true,
      message: "UserProfile created successfully",
      data: newProfile,
    });
  } catch (error) {
    console.error("Error creating UserProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "UserProfile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error getting my profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const profileId = req.params.userId;
    const profile = await UserProfile.findById(profileId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "UserProfile not found",
      });
    }

    if (profile.accountType === "public") {
      return res.status(200).json({
        success: true,
        data: {
          _id: profile._id,
          name: profile.name,
          profileImage: profile.profileImage,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: {
          _id: profile._id,
          name: "Unknown User",
          profileImage: null,
        },
      });
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];

      if (value !== undefined && value !== null && value !== "") {
        updates[key] = value;
      }
    });

    console.log(updates);
    const userProfile = await UserProfile.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    );

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "UserProfile not found",
      });
    }
    console.log(userProfile)
    return res.status(200).json({
      success: true,
      message: "UserProfile updated successfully",
      data: userProfile,
    });

  } catch (error) {
    console.error("Error updating UserProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Toggle account visibility: "public" or "private"
export const updateAccountType = async (req, res) => {
  try {
    const { accountType } = req.body;

    if (!accountType || !["public", "private"].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: "accountType must be either 'public' or 'private'",
      });
    }

    const userProfile = await UserProfile.findByIdAndUpdate(
      req.user.id,
      { $set: { accountType } },
      { new: true }
    );

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "UserProfile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Account is now ${accountType}`,
      data: {
        _id: userProfile._id,
        accountType: userProfile.accountType,
      },
    });
  } catch (error) {
    console.error("Error updating account type:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
