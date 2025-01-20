import React, { useState, useEffect } from "react";

export function ProfileSettings({ userId }: { userId: string }): JSX.Element {
  const [profile, setProfile] = useState<{
    picture: string;
    status: string;
    bio: string;
    location: string;
    website: string;
    social_media_links: string;
    theme: string;
    avatar: string;
    interaction_style: string;
    badges: string[];
    phone: string;
    email: string;
    birthday: string;
  }>({
    picture: "",
    status: "",
    bio: "",
    location: "",
    website: "",
    social_media_links: "",
    theme: "",
    avatar: "",
    interaction_style: "",
    badges: [],
    phone: "",
    email: "",
    birthday: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Profile Settings</h3>
      <label>
        Profile Picture:
        <input
          type="text"
          name="picture"
          value={profile.picture}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Status:
        <input
          type="text"
          name="status"
          value={profile.status}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Bio:
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Location:
        <input
          type="text"
          name="location"
          value={profile.location}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Website:
        <input
          type="text"
          name="website"
          value={profile.website}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Social Media Links:
        <input
          type="text"
          name="social_media_links"
          value={profile.social_media_links}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Theme:
        <input
          type="text"
          name="theme"
          value={profile.theme}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Avatar:
        <input
          type="text"
          name="avatar"
          value={profile.avatar}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Interaction Style:
        <input
          type="text"
          name="interaction_style"
          value={profile.interaction_style}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Badges:
        <input
          type="text"
          name="badges"
          value={profile.badges.join(", ")}
          onChange={(e) => {
            const badges = e.target.value.split(",").map((badge) => badge.trim());
            setProfile((prevProfile) => ({
              ...prevProfile,
              badges,
            }));
          }}
        />
      </label>
      <label>
        Phone:
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Email:
        <input
          type="text"
          name="email"
          value={profile.email}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Birthday:
        <input
          type="text"
          name="birthday"
          value={profile.birthday}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
