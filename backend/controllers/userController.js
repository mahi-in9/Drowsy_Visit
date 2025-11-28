import User from "../models/user.js";

/* =====================================================
   GET ALL USERS (Search + Exclude Self + Follow-State)
====================================================== */
export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const search = req.query.search || "";

    const filter = {
      _id: { $ne: loggedInUserId },
      $or: [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    // Fetch users (excluding sensitive fields)
    const users = await User.find(filter).select(
      "name username email profilePic followers"
    );

    // Add follow-state for each user
    const finalUsers = users.map((u) => ({
      ...u._doc,
      isFollowing: u.followers?.includes(loggedInUserId),
    }));

    return res.status(200).json({
      success: true,
      count: finalUsers.length,
      users: finalUsers,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error fetching users" });
  }
};

/* =====================================================
   FOLLOW USER
====================================================== */
export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id; // user to follow
    const loggedInUserId = req.user._id;

    if (targetUserId === String(loggedInUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot follow yourself" });
    }

    await User.findByIdAndUpdate(loggedInUserId, {
      $addToSet: { following: targetUserId },
    });

    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: loggedInUserId },
    });

    return res.status(200).json({
      success: true,
      message: "Followed successfully",
    });
  } catch (error) {
    console.error("Follow User Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error following user" });
  }
};

/* =====================================================
   UNFOLLOW USER
====================================================== */
export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const loggedInUserId = req.user._id;

    await User.findByIdAndUpdate(loggedInUserId, {
      $pull: { following: targetUserId },
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });

    return res.status(200).json({
      success: true,
      message: "Unfollowed successfully",
    });
  } catch (error) {
    console.error("Unfollow User Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error unfollowing user" });
  }
};
