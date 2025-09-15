// src/features/profile/utils/icons.js
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaGlobe,
  FaPlus,
  FaTimes,
  FaEdit,
} from "react-icons/fa";

export const socialPlatforms = {
  github: {
    name: "GitHub",
    icon: FaGithub,
    validator: (u) => u.includes("github.com"),
  },
  linkedin: {
    name: "LinkedIn",
    icon: FaLinkedin,
    validator: (u) => u.includes("linkedin.com"),
  },
  instagram: {
    name: "Instagram",
    icon: FaInstagram,
    validator: (u) => u.includes("instagram.com"),
  },
  twitter: {
    name: "Twitter",
    icon: FaTwitter,
    validator: (u) => u.includes("twitter.com"),
  },
  website: {
    name: "Website",
    icon: FaGlobe,
    validator: () => true, // allow any URL
  },
};

// General-purpose icons
export const uiIcons = {
  add: FaPlus,
  close: FaTimes,
  edit: FaEdit,
};
